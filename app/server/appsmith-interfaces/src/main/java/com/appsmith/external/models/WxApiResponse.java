package com.appsmith.external.models;

import lombok.*;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WxApiResponse implements AppsmithDomain {

    // error info
    Integer errcode;
    String errmsg;

    // access token
    String access_token;

}
