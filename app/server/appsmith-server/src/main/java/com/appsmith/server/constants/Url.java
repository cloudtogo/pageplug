package com.appsmith.server.constants;

public interface Url {
    String BASE_URL = "/api";
    String VERSION = "/v1";
    String LOGIN_URL = BASE_URL + VERSION + "/login";
    String LOGOUT_URL = BASE_URL + VERSION + "/logout";
    String WIDGET_URL = BASE_URL + VERSION + "/widgets";
    String ORGANIZATION_URL = BASE_URL + VERSION + "/organizations";
    String LAYOUT_URL = BASE_URL + VERSION + "/layouts";
    String PLUGIN_URL = BASE_URL + VERSION + "/plugins";
    String SETTING_URL = BASE_URL + VERSION + "/settings";
    String DATASOURCE_URL = BASE_URL + VERSION + "/datasources";
    String ACTION_URL = BASE_URL + VERSION + "/actions";
    String USER_URL = BASE_URL + VERSION + "/users";
    String APPLICATION_URL = BASE_URL + VERSION + "/applications";
    String PAGE_URL = BASE_URL + VERSION + "/pages";
    String PROPERTY_URL = BASE_URL + VERSION + "/properties";
    String CONFIG_URL = BASE_URL + VERSION + "/configs";
    String TEAM_URL = BASE_URL + VERSION + "/teams";
    String GROUP_URL = BASE_URL + VERSION + "/groups";
    String PERMISSION_URL = BASE_URL + VERSION + "/permissions";
    String SIGNUP_URL = BASE_URL + VERSION + "/signup";
    String COLLECTION_URL = BASE_URL + VERSION + "/collections";
    String IMPORT_URL = BASE_URL + VERSION + "/import";
    String PROVIDER_URL = BASE_URL + VERSION + "/providers";
    String MARKETPLACE_URL = BASE_URL + VERSION + "/marketplace";
    String API_TEMPLATE_URL = BASE_URL + VERSION + "/templates";
    String MARKETPLACE_ITEM_URL = BASE_URL + VERSION + "/items";
}
