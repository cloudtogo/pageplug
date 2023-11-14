package com.external.plugins.exceptions;

public class MongoPluginErrorMessages {
    private MongoPluginErrorMessages() {
        // Prevents instantiation
    }

    public static final String QUERY_EXECUTION_FAILED_ERROR_MSG = "Your Mongo query failed to execute.";

    public static final String CONNECTION_STRING_PARSING_FAILED_ERROR_MSG =
            "The Appsmith server has failed to parse the Mongo connection string URI.";

    public static final String NO_CONNECTION_STRING_URI_ERROR_MSG = "Could not find any Mongo connection string URI.";

    public static final String UNEXPECTED_SSL_OPTION_ERROR_MSG =
            "The Appsmith server has found an unexpected SSL option: %s. Please reach out to"
                    + " Appsmith customer support to resolve this.";

    public static final String UNPARSABLE_FIELDNAME_ERROR_MSG = "%s has an invalid JSON format.";

    public static final String NO_VALID_MONGO_COMMAND_FOUND_ERROR_MSG = "No valid mongo command found.";

    public static final String FIELD_WITH_NO_CONFIGURATION_ERROR_MSG = "Try again after configuring the fields : %s";

    public static final String PIPELINE_ARRAY_PARSING_FAILED_ERROR_MSG =
            "Array of pipelines could not be parsed into expected Mongo BSON Array format.";

    public static final String PIPELINE_STAGE_NOT_VALID_ERROR_MSG = "Pipeline stage is not a valid JSON object.";

    public static final String DOCUMENTS_NOT_PARSABLE_INTO_JSON_ARRAY_ERROR_MSG =
            "Documents could not be parsed into expected JSON Array format.";

    public static final String UNSUPPORTED_OPERATION_PARSE_COMMAND_ERROR_MSG =
            "Unsupported Operation : All mongo commands must implement parseCommand.";

    public static final String UNSUPPORTED_OPERATION_GENERATE_TEMPLATE_ERROR_MSG =
            "Unsupported Operation : All mongo commands must implement generateTemplate.";

    public static final String UNSUPPORTED_OPERATION_GET_RAW_QUERY_ERROR_MSG =
            "Unsupported Operation : All mongo commands must implement getRawQuery.";

    public static final String QUERY_INVALID_ERROR_MSG = "Your query is invalid";

    public static final String MONGO_CLIENT_NULL_ERROR_MSG = "Mongo client object is null.";

    /*
    ************************************************************************************************************************************************
                                       Error messages related to validation of datasource.
    ************************************************************************************************************************************************
    */

    public static final String DS_CREATION_FAILED_ERROR_MSG = "数据源配置无效，请检查配置参数是否正确。";

    public static final String DS_TIMEOUT_ERROR_MSG = "连接超时，请检查数据源配置字段是否填写正确。";

    public static final String DS_GET_STRUCTURE_ERROR_MSG = "Pageplug 无法获取数据库结构，请确保数据库具有读取权限以解决此问题。";

    public static final String DS_DEFAULT_DATABASE_NAME_INVALID_ERROR_MSG = "默认数据库名称无效，找不到该名称对应的数据库。";

    public static final String DS_EMPTY_CONNECTION_URI_ERROR_MSG =
            "“Mongo 连接字符串 URI”字段为空，请编辑“Mongo 连接 URI”字段以提供连接 URI。";

    public static final String DS_INVALID_CONNECTION_STRING_URI_ERROR_MSG = "Mongo 连接字符串 URI 的格式似乎不正确，请检查 URI。";

    public static final String DS_MISSING_DEFAULT_DATABASE_NAME_ERROR_MSG = "缺少默认数据库名称。";

    public static final String DS_INVALID_AUTH_DATABASE_NAME = "认证数据库名称无效，找不到该名称对应的数据库。";

    public static final String DS_MISSING_ENDPOINTS_ERROR_MSG = "缺少端口。";

    public static final String DS_NO_PORT_EXPECTED_IN_REPLICA_SET_CONNECTION_ERROR_MSG =
            "不应为 REPLICA_SET 连接指定端口。如果您要指定所有分片，请添加多个。";

    public static final String DS_USING_URI_BUT_EXPECTED_FORM_FIELDS_ERROR_MSG =
            "似乎您正在尝试使用 MongoDB 连接字符串 URI。请提取相关字段并使用提取的值填写表单。有关详细信息，请查阅 Pageplug 的 MongoDB 文档。或者，您可以直接使用“使用 MongoDB 连接字符串 URI”下拉菜单中的“从连接字符串 URI 导入”选项使用 URI 连接字符串。";

    public static final String DS_INVALID_AUTH_TYPE_ERROR_MSG = "无效的 authType。必须是以下值之一：%s";

    public static final String DS_SSL_CONFIGURATION_FETCHING_ERROR_MSG =
            "Pageplug 服务器无法从数据源配置表单中获取 SSL 配置。请联系 Pageplug 客户支持解决此问题。";
}
