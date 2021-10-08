package com.appsmith.external.models;

import lombok.*;

import java.util.Map;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CloudOSApiResponse implements AppsmithDomain {

    // return code
    Integer code;

    // return data
    Map<String, Map<String, ?>> data;

    // error message
    String message;

}
