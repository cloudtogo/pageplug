package com.external.plugins.utils;

import com.appsmith.external.datatypes.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DmSpecificDataTypes {
    public static final Map<ClientDataType, List<AppsmithType>> pluginSpecificTypes = new HashMap<>();

    static {
        pluginSpecificTypes.put(ClientDataType.NULL, List.of(new NullType()));

        pluginSpecificTypes.put(ClientDataType.ARRAY, List.of(new NullArrayType(), new ArrayType()));

        pluginSpecificTypes.put(ClientDataType.BOOLEAN, List.of(new BooleanType()));

        pluginSpecificTypes.put(
                ClientDataType.NUMBER,
                List.of(new IntegerType(), new LongType(), new DoubleType(), new BigDecimalType()));

        /*
           JsonObjectType is the preferred server-side data type when the client-side data type is of type OBJECT.
           Fallback server-side data type for client-side OBJECT type is String.
        */
        pluginSpecificTypes.put(ClientDataType.OBJECT, List.of(new JsonObjectType()));

        pluginSpecificTypes.put(
                ClientDataType.STRING, List.of(new TimeType(), new DateType(), new TimestampType(), new StringType()));
    }
}
