package com.appsmith.external.models;

import lombok.*;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CloudOSDeployService implements AppsmithDomain {

    // bp name
    String componentName;

    // bp id
    String componentId;

    // service address
    String serviceAddress;
}
