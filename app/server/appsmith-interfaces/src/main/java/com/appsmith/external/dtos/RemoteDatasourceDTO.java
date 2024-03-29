package com.appsmith.external.dtos;

import com.appsmith.external.models.DatasourceConfiguration;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class RemoteDatasourceDTO {
    String id;
    DatasourceConfiguration datasourceConfiguration;
}
