package com.external.plugins.utils;

import com.appsmith.external.exceptions.pluginExceptions.AppsmithPluginException;
import com.appsmith.external.plugins.AppsmithPluginErrorUtils;
import io.r2dbc.spi.R2dbcNonTransientResourceException;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TidbErrorUtils extends AppsmithPluginErrorUtils {

    private static TidbErrorUtils tidbErrorUtils;

    public static TidbErrorUtils getInstance() {
        if (tidbErrorUtils == null) {
            tidbErrorUtils = new TidbErrorUtils();
        }
        return tidbErrorUtils;
    }

    /**
     * Extract small readable portion of error message from a larger less comprehensible error message.
     * @param error - any error object
     * @return readable error message
     */
    @Override
    public String getReadableError(Throwable error) {
        Throwable externalError;

        // If the external error is wrapped inside Appsmith error, then extract the external error first.
        if (error instanceof AppsmithPluginException) {
            if (((AppsmithPluginException) error).getExternalError() == null) {
                return error.getMessage();
            }

            externalError = ((AppsmithPluginException) error).getExternalError();
        } else {
            externalError = error;
        }

        if (externalError instanceof io.r2dbc.spi.R2dbcNonTransientResourceException) {

            /**
             *@param [9000] [H1000] Fail to establish connection to [host:port] :
             * Access denied for user 'username'@'host' (using password: NO)
             *@return Access denied for user 'username'@'host'
             */
            R2dbcNonTransientResourceException r2dbcNonTransientResourceException =
                    (R2dbcNonTransientResourceException) externalError;
            return r2dbcNonTransientResourceException
                    .getMessage()
                    .split(" : ")[1]
                    .split(" \\(")[0]
                    .trim();
        }

        return externalError.getMessage();
    }
}
