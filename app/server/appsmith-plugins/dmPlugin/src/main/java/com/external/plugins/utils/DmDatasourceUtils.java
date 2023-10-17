package com.external.plugins.utils;

import com.appsmith.external.exceptions.pluginExceptions.AppsmithPluginError;
import com.appsmith.external.exceptions.pluginExceptions.AppsmithPluginException;
import com.appsmith.external.exceptions.pluginExceptions.StaleConnectionException;
import com.appsmith.external.models.*;
import com.external.plugins.exceptions.DmErrorMessages;
import com.external.plugins.exceptions.DmPluginError;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import com.zaxxer.hikari.HikariPoolMXBean;
import com.zaxxer.hikari.pool.HikariPool;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.ObjectUtils;
import org.springframework.util.StringUtils;
import reactor.core.publisher.Mono;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.MessageFormat;
import java.util.*;
import java.util.stream.Collectors;

import static com.appsmith.external.helpers.PluginUtils.safelyCloseSingleConnectionFromHikariCP;
import static com.external.plugins.DmPlugin.DmPluginExecutor.scheduler;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.springframework.util.CollectionUtils.isEmpty;

@Slf4j
public class DmDatasourceUtils {

    public static final int MINIMUM_POOL_SIZE = 1;
    public static final int MAXIMUM_POOL_SIZE = 5;
    public static final long LEAK_DETECTION_TIME_MS = 60 * 1000;
    public static final String JDBC_DRIVER = "dm.jdbc.driver.DmDriver";

    public static final String DM_URL_PREFIX = "jdbc:dm://";

    public static final String DM_PRIMARY_KEY_INDICATOR = "P";

    /**
     * Example output:
     * +------------+-----------+-----------------+
     * | TABLE_NAME |COLUMN_NAME| DATA_TYPE       |
     * +------------+-----------+-----------------+
     * | CLUB       | ID        | NUMBER          |
     * | STUDENTS   | NAME      | VARCHAR2        |
     * +------------+-----------+-----------------+
     */
    public static final String DM_SQL_QUERY_TO_GET_ALL_TABLE_COLUMN_TYPE =
            "SELECT table_name,column_name,data_type FROM USER_TAB_COLS";

    /**
     * Example output:
     * +------------+-----------+-----------------+-----------------+-------------------+
     * | TABLE_NAME |COLUMN_NAME| CONSTRAINT_TYPE | CONSTRAINT_NAME | R_CONSTRAINT_NAME |
     * +------------+-----------+-----------------+-----------------+-------------------+
     * | CLUB       | ID        | R               | FK_STUDENTS_ID  | PK_STUDENTS_ID    |
     * | STUDENTS   | ID        | P               | SYS_C006397     | null              |
     * +------------+-----------+-----------------+-----------------+-------------------+
     */
    public static final String DM_SQL_QUERY_TO_GET_ALL_TABLE_COLUMN_KEY_CONSTRAINTS = "SELECT " + "    cols.table_name,"
            + "    cols.column_name,"
            + "    cons.constraint_type,"
            + "    cons.constraint_name,"
            + "    cons.r_constraint_name "
            + "FROM "
            + "    all_cons_columns cols"
            + "    JOIN all_constraints cons "
            + "        ON cols.owner = cons.owner "
            + "        AND cols.constraint_name = cons.constraint_name"
            + "    JOIN all_tab_cols tab_cols "
            + "        ON cols.owner = tab_cols.owner "
            + "        AND cols.table_name = tab_cols.table_name "
            + "        AND cols.column_name = tab_cols.column_name "
            + "WHERE"
            + "    cons.constraint_type IN ( 'P', 'R' ) "
            + "ORDER BY"
            + "    cols.table_name,"
            + "    cols.position;";

    public static void datasourceDestroy(HikariDataSource connectionPool) {
        if (connectionPool != null) {
            log.debug(Thread.currentThread().getName() + ": Closing Dm DB Connection Pool");
            connectionPool.close();
        }
    }

    public static Set<String> validateDatasource(DatasourceConfiguration datasourceConfiguration) {
        Set<String> invalids = new HashSet<>();

        if (isEmpty(datasourceConfiguration.getEndpoints())) {
            invalids.add(DmErrorMessages.DS_MISSING_ENDPOINT_ERROR_MSG);
        } else {
            for (final Endpoint endpoint : datasourceConfiguration.getEndpoints()) {
                if (isBlank(endpoint.getHost())) {
                    invalids.add(DmErrorMessages.DS_MISSING_HOSTNAME_ERROR_MSG);
                } else if (endpoint.getHost().contains("/")
                        || endpoint.getHost().contains(":")) {
                    invalids.add(String.format(DmErrorMessages.DS_INVALID_HOSTNAME_ERROR_MSG, endpoint.getHost()));
                }
            }
        }

        if (datasourceConfiguration.getAuthentication() == null) {
            invalids.add(DmErrorMessages.DS_MISSING_AUTHENTICATION_DETAILS_ERROR_MSG);

        } else {
            DBAuth authentication = (DBAuth) datasourceConfiguration.getAuthentication();
            if (isBlank(authentication.getUsername())) {
                invalids.add(DmErrorMessages.DS_MISSING_USERNAME_ERROR_MSG);
            }

            if (isBlank(authentication.getPassword())) {
                invalids.add(DmErrorMessages.DS_MISSING_PASSWORD_ERROR_MSG);
            }
        }

        /*
         * - Ideally, it is never expected to be null because the SSL dropdown is set to a initial value.
         */
        if (datasourceConfiguration.getConnection() == null
                || datasourceConfiguration.getConnection().getSsl() == null
                || datasourceConfiguration.getConnection().getSsl().getAuthType() == null) {
            invalids.add(DmErrorMessages.SSL_CONFIGURATION_ERROR_MSG);
        }

        return invalids;
    }

    public static Mono<DatasourceStructure> getStructure(
            HikariDataSource connectionPool, DatasourceConfiguration datasourceConfiguration) {
        final DatasourceStructure structure = new DatasourceStructure();
        final Map<String, DatasourceStructure.Table> tableNameToTableMap = new LinkedHashMap<>();

        return Mono.fromSupplier(() -> {
                    Connection connectionFromPool;
                    try {
                        connectionFromPool = getConnectionFromConnectionPool(connectionPool);
                    } catch (SQLException | StaleConnectionException e) {
                        // The function can throw either StaleConnectionException or SQLException. The
                        // underlying hikari library throws SQLException in case the pool is closed or there is an issue
                        // initializing the connection pool which can also be translated in our world to
                        // StaleConnectionException and should then trigger the destruction and recreation of the pool.
                        return Mono.error(e instanceof StaleConnectionException ? e : new StaleConnectionException());
                    }

                    logHikariCPStatus("Before getting Dm DB schema", connectionPool);

                    try (Statement statement = connectionFromPool.createStatement()) {
                        // Set table names. For each table set its column names and column types.
                        setTableNamesAndColumnNamesAndColumnTypes(statement, tableNameToTableMap);

                        // Set primary key and foreign key constraints.
                        setPrimaryAndForeignKeyInfoInTables(statement, tableNameToTableMap);

                    } catch (SQLException throwable) {
                        return Mono.error(new AppsmithPluginException(
                                AppsmithPluginError.PLUGIN_GET_STRUCTURE_ERROR,
                                DmErrorMessages.GET_STRUCTURE_ERROR_MSG,
                                throwable.getCause(),
                                "SQLSTATE: " + throwable.getSQLState()));
                    } finally {
                        logHikariCPStatus("After getting DM DB schema", connectionPool);
                        safelyCloseSingleConnectionFromHikariCP(
                                connectionFromPool, "Error returning DM connection to pool " + "during get structure");
                    }

                    // Set SQL query templates
                    setSQLQueryTemplates(tableNameToTableMap);

                    structure.setTables(new ArrayList<>(tableNameToTableMap.values()));
                    return structure;
                })
                .map(resultStructure -> (DatasourceStructure) resultStructure)
                .subscribeOn(scheduler);
    }

    private static void setSQLQueryTemplates(Map<String, DatasourceStructure.Table> tableNameToTableMap) {
        tableNameToTableMap.values().forEach(table -> {
            LinkedHashMap<String, String> columnNameToSampleColumnDataMap = new LinkedHashMap<>();
            table.getColumns().forEach(column -> {
                columnNameToSampleColumnDataMap.put(column.getName(), getSampleColumnData(column.getType()));
            });

            String selectQueryTemplate =
                    MessageFormat.format("SELECT * FROM {0} WHERE " + "ROWNUM < 10", table.getName());
            String insertQueryTemplate = MessageFormat.format(
                    "INSERT INTO {0} ({1}) " + "VALUES ({2})",
                    table.getName(),
                    getSampleColumnNamesCSVString(columnNameToSampleColumnDataMap),
                    getSampleColumnDataCSVString(columnNameToSampleColumnDataMap));
            String updateQueryTemplate = MessageFormat.format(
                    "UPDATE {0} SET {1} WHERE " + "1=0 -- Specify a valid condition here. Removing the condition may "
                            + "update every row in the table!",
                    table.getName(), getSampleOneColumnUpdateString(columnNameToSampleColumnDataMap));
            String deleteQueryTemplate = MessageFormat.format(
                    "DELETE FROM {0} WHERE 1=0" + " -- Specify a valid condition here. Removing the condition may "
                            + "delete everything in the table!",
                    table.getName());

            table.getTemplates()
                    .add(new DatasourceStructure.Template(
                            "SELECT", null, Map.of("body", Map.of("data", selectQueryTemplate))));
            table.getTemplates()
                    .add(new DatasourceStructure.Template(
                            "INSERT", null, Map.of("body", Map.of("data", insertQueryTemplate))));
            table.getTemplates()
                    .add(new DatasourceStructure.Template(
                            "UPDATE", null, Map.of("body", Map.of("data", updateQueryTemplate))));
            table.getTemplates()
                    .add(new DatasourceStructure.Template(
                            "DELETE", null, Map.of("body", Map.of("data", deleteQueryTemplate))));
        });
    }

    private static String getSampleOneColumnUpdateString(
            LinkedHashMap<String, String> columnNameToSampleColumnDataMap) {
        return MessageFormat.format(
                "{0}={1}",
                columnNameToSampleColumnDataMap.keySet().stream().findFirst().orElse("id"),
                columnNameToSampleColumnDataMap.values().stream().findFirst().orElse("'uid'"));
    }

    private static String getSampleColumnNamesCSVString(LinkedHashMap<String, String> columnNameToSampleColumnDataMap) {
        return String.join(", ", columnNameToSampleColumnDataMap.keySet());
    }

    private static String getSampleColumnDataCSVString(LinkedHashMap<String, String> columnNameToSampleColumnDataMap) {
        return String.join(", ", columnNameToSampleColumnDataMap.values());
    }

    private static String getSampleColumnData(String type) {
        if (type == null) {
            return "NULL";
        }

        switch (type.toUpperCase()) {
            case "NUMBER":
                return "1";
            case "FLOAT": /* Fall through */
            case "DOUBLE":
                return "1.0";
            case "CHAR": /* Fall through */
            case "NCHAR": /* Fall through */
            case "VARCHAR": /* Fall through */
            case "VARCHAR2": /* Fall through */
            case "NVARCHAR": /* Fall through */
            case "NVARCHAR2":
                return "'text'";
            case "NULL": /* Fall through */
            default:
                return "NULL";
        }
    }

    /**
     * Run a SQL query to fetch all user accessible tables along with their column names and if the column is a
     * primary or foreign key. Since the remote table relationship for a foreign key column is not explicitly defined
     * we create a 1:1 map here for primary_key -> table, and foreign_key -> table so that we can find both the
     * tables to which a foreign key is related to.
     * Please check the SQL query macro definition to find a sample response as comment.
     */
    private static void setPrimaryAndForeignKeyInfoInTables(
            Statement statement, Map<String, DatasourceStructure.Table> tableNameToTableMap) throws SQLException {
        Map<String, String> primaryKeyConstraintNameToTableNameMap = new HashMap<>();
        Map<String, String> primaryKeyConstraintNameToColumnNameMap = new HashMap<>();
        Map<String, String> foreignKeyConstraintNameToTableNameMap = new HashMap<>();
        Map<String, String> foreignKeyConstraintNameToColumnNameMap = new HashMap<>();
        Map<String, String> foreignKeyConstraintNameToRemoteConstraintNameMap = new HashMap<>();

        try (ResultSet columnsResultSet =
                statement.executeQuery(DM_SQL_QUERY_TO_GET_ALL_TABLE_COLUMN_KEY_CONSTRAINTS)) {
            while (columnsResultSet.next()) {
                final String tableName = columnsResultSet.getString("TABLE_NAME");
                final String columnName = columnsResultSet.getString("COLUMN_NAME");
                final String constraintType = columnsResultSet.getString("CONSTRAINT_TYPE");
                final String constraintName = columnsResultSet.getString("CONSTRAINT_NAME");
                final String remoteConstraintName = columnsResultSet.getString("R_CONSTRAINT_NAME");

                if (DM_PRIMARY_KEY_INDICATOR.equalsIgnoreCase(constraintType)) {
                    primaryKeyConstraintNameToTableNameMap.put(constraintName, tableName);
                    primaryKeyConstraintNameToColumnNameMap.put(constraintName, columnName);
                } else {
                    foreignKeyConstraintNameToTableNameMap.put(constraintName, tableName);
                    foreignKeyConstraintNameToColumnNameMap.put(constraintName, columnName);
                    foreignKeyConstraintNameToRemoteConstraintNameMap.put(constraintName, remoteConstraintName);
                }
            }

            primaryKeyConstraintNameToColumnNameMap.keySet().stream()
                    .filter(constraintName -> {
                        String tableName = primaryKeyConstraintNameToTableNameMap.get(constraintName);
                        return tableNameToTableMap.containsKey(tableName);
                    })
                    .forEach(constraintName -> {
                        String tableName = primaryKeyConstraintNameToTableNameMap.get(constraintName);
                        DatasourceStructure.Table table = tableNameToTableMap.get(tableName);
                        String columnName = primaryKeyConstraintNameToColumnNameMap.get(constraintName);
                        table.getKeys().add(new DatasourceStructure.PrimaryKey(constraintName, List.of(columnName)));
                    });

            foreignKeyConstraintNameToColumnNameMap.keySet().stream()
                    .filter(constraintName -> {
                        String tableName = foreignKeyConstraintNameToTableNameMap.get(constraintName);
                        return tableNameToTableMap.containsKey(tableName);
                    })
                    .forEach(constraintName -> {
                        String tableName = foreignKeyConstraintNameToTableNameMap.get(constraintName);
                        DatasourceStructure.Table table = tableNameToTableMap.get(tableName);
                        String columnName = foreignKeyConstraintNameToColumnNameMap.get(constraintName);
                        String remoteConstraintName =
                                foreignKeyConstraintNameToRemoteConstraintNameMap.get(constraintName);
                        String remoteColumn = primaryKeyConstraintNameToColumnNameMap.get(remoteConstraintName);
                        table.getKeys()
                                .add(new DatasourceStructure.ForeignKey(
                                        constraintName, List.of(columnName), List.of(remoteColumn)));
                    });
        }
    }

    /**
     * Run a SQL query to fetch all tables accessible to user along with their columns and data  type of each column.
     * Then read the response and populate Appsmith's Table object with the same.
     * Please check the SQL query macro definition to find a sample response as comment.
     */
    private static void setTableNamesAndColumnNamesAndColumnTypes(
            Statement statement, Map<String, DatasourceStructure.Table> tableNameToTableMap) throws SQLException {
        try (ResultSet columnsResultSet = statement.executeQuery(DM_SQL_QUERY_TO_GET_ALL_TABLE_COLUMN_TYPE)) {
            while (columnsResultSet.next()) {
                final String tableName = columnsResultSet.getString("TABLE_NAME");
                if (!tableNameToTableMap.containsKey(tableName)) {
                    tableNameToTableMap.put(
                            tableName,
                            new DatasourceStructure.Table(
                                    DatasourceStructure.TableType.TABLE,
                                    "",
                                    tableName,
                                    new ArrayList<>(),
                                    new ArrayList<>(),
                                    new ArrayList<>()));
                }
                final DatasourceStructure.Table table = tableNameToTableMap.get(tableName);
                table.getColumns()
                        .add(new DatasourceStructure.Column(
                                columnsResultSet.getString("COLUMN_NAME"),
                                columnsResultSet.getString("DATA_TYPE"),
                                null,
                                false));
            }
        }
    }

    public static HikariDataSource createConnectionPool(DatasourceConfiguration datasourceConfiguration)
            throws AppsmithPluginException {
        HikariConfig config = new HikariConfig();

        config.setDriverClassName(JDBC_DRIVER);
        config.setMinimumIdle(MINIMUM_POOL_SIZE);
        config.setMaximumPoolSize(MAXIMUM_POOL_SIZE);

        // Set authentication properties
        DBAuth authentication = (DBAuth) datasourceConfiguration.getAuthentication();
        if (StringUtils.hasText(authentication.getUsername())) {
            config.setUsername(authentication.getUsername());
        }
        if (StringUtils.hasText(authentication.getPassword())) {
            config.setPassword(authentication.getPassword());
        }

        // Set up the connection URL
        StringBuilder urlBuilder = new StringBuilder(DM_URL_PREFIX);
        List<String> hosts = datasourceConfiguration.getEndpoints().stream()
                .map(endpoint -> endpoint.getHost() + ":" + ObjectUtils.defaultIfNull(endpoint.getPort(), 5236))
                .collect(Collectors.toList());
        urlBuilder.append(String.join(",", hosts));

        /*
         * - Ideally, it is never expected to be null because the SSL dropdown is set to a initial value.
         */
        if (datasourceConfiguration.getConnection() == null
                || datasourceConfiguration.getConnection().getSsl() == null
                || datasourceConfiguration.getConnection().getSsl().getAuthType() == null) {
            throw new AppsmithPluginException(
                    DmPluginError.DM_PLUGIN_ERROR, DmErrorMessages.SSL_CONFIGURATION_ERROR_MSG);
        }

        SSLDetails.AuthType sslAuthType =
                datasourceConfiguration.getConnection().getSsl().getAuthType();
        switch (sslAuthType) {
            case DEFAULT:
                /* do nothing */

                break;
            default:
                throw new AppsmithPluginException(
                        DmPluginError.DM_PLUGIN_ERROR,
                        String.format(DmErrorMessages.INVALID_SSL_OPTION_ERROR_MSG, sslAuthType));
        }

        String url = urlBuilder.toString();
        config.setJdbcUrl(url);

        // Configuring leak detection threshold for 60 seconds. Any connection which hasn't been released in 60 seconds
        // should get tracked (maybe falsely for long-running queries) as leaked connection
        config.setLeakDetectionThreshold(LEAK_DETECTION_TIME_MS);

        // Now create the connection pool from the configuration
        HikariDataSource datasource;
        try {
            datasource = new HikariDataSource(config);
        } catch (HikariPool.PoolInitializationException e) {
            throw new AppsmithPluginException(
                    AppsmithPluginError.PLUGIN_DATASOURCE_ARGUMENT_ERROR,
                    DmErrorMessages.CONNECTION_POOL_CREATION_FAILED_ERROR_MSG,
                    e.getMessage());
        }

        return datasource;
    }

    /**
     * First checks if the connection pool is still valid. If yes, we fetch a connection from the pool and return
     * In case a connection is not available in the pool, SQL Exception is thrown
     */
    public static java.sql.Connection getConnectionFromConnectionPool(HikariDataSource connectionPool)
            throws SQLException {

        if (connectionPool == null || connectionPool.isClosed() || !connectionPool.isRunning()) {
            System.out.println(Thread.currentThread().getName()
                    + ": Encountered stale connection pool in Dm plugin. Reporting back.");
            throw new StaleConnectionException();
        }

        return connectionPool.getConnection();
    }

    public static void logHikariCPStatus(String logPrefix, HikariDataSource connectionPool) {
        HikariPoolMXBean poolProxy = connectionPool.getHikariPoolMXBean();
        int idleConnections = poolProxy.getIdleConnections();
        int activeConnections = poolProxy.getActiveConnections();
        int totalConnections = poolProxy.getTotalConnections();
        int threadsAwaitingConnection = poolProxy.getThreadsAwaitingConnection();
        log.debug(MessageFormat.format(
                "{0}: Hikari Pool stats : active - {1} , idle - {2}, awaiting - {3} , total - {4}",
                logPrefix, activeConnections, idleConnections, threadsAwaitingConnection, totalConnections));
    }
}
