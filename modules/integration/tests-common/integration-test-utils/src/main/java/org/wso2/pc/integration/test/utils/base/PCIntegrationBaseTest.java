/*
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
package org.wso2.pc.integration.test.utils.base;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.automation.engine.context.AutomationContext;
import org.wso2.carbon.automation.engine.context.TestUserMode;
import org.wso2.carbon.automation.engine.context.beans.User;
import org.wso2.carbon.automation.engine.frameworkutils.FrameworkPathUtil;
import org.wso2.carbon.integration.common.admin.client.SecurityAdminServiceClient;
import org.wso2.carbon.integration.common.utils.LoginLogoutClient;

import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Base class of all integration tests
 */
public class PCIntegrationBaseTest {

    protected Log log = LogFactory.getLog(PCIntegrationBaseTest.class);
    protected AutomationContext automationContext;
    protected String backendURL;
    protected String sessionCookie;

    protected String webAppURL;
    protected SecurityAdminServiceClient securityAdminServiceClient;
    protected LoginLogoutClient loginLogoutClient;
    protected User userInfo;
    protected String publisherProcessAPIBaseUrl;
    protected String publisherPackageAPIBaseUrl;

    protected AutomationContext storeContext;
    protected AutomationContext publisherContext;
    protected TestUserMode userMode;

    protected void init() throws Exception {
        init(TestUserMode.SUPER_TENANT_ADMIN);
    }

    protected void init(TestUserMode testUserMode) throws Exception {

        storeContext = new AutomationContext("PC", "explorer", testUserMode);
        publisherContext = new AutomationContext("PC", "designer", testUserMode);
        automationContext = new AutomationContext("PC",testUserMode);
        loginLogoutClient = new LoginLogoutClient(automationContext);
        sessionCookie = loginLogoutClient.login();
        backendURL = automationContext.getContextUrls().getBackEndUrl();
        webAppURL = automationContext.getContextUrls().getWebAppURL();
        userInfo = automationContext.getContextTenant().getContextUser();
        publisherProcessAPIBaseUrl = automationContext.getContextUrls().getSecureServiceUrl().replace("services",
                "designer/assets/process/apis/");
        publisherPackageAPIBaseUrl = automationContext.getContextUrls().getSecureServiceUrl().replace("services",
                "designer/assets/package/apis/");
    }

    protected void initPublisher(String productGroupName, String instanceName,
                                 TestUserMode userMode, String userKey)
            throws XPathExpressionException {
        automationContext = new AutomationContext(productGroupName, instanceName, userMode);
        backendURL = automationContext.getContextUrls().getBackEndUrl();
    }

    protected String getBackendURL() throws XPathExpressionException {
        return automationContext.getContextUrls().getBackEndUrl();
    }

    protected String getSessionCookie() throws Exception {
        LoginLogoutClient loginLogoutClient = new LoginLogoutClient(automationContext);
        return loginLogoutClient.login();
    }

    protected String getServiceURL() throws XPathExpressionException {
        return automationContext.getContextUrls().getServiceUrl();
    }

    protected String getTestArtifactLocation() {
        return FrameworkPathUtil.getSystemResourceLocation();
    }

    /**
     * Return file content with a String
     *
     * @param filePath
     * @return
     * @throws IOException
     */
    protected String readFile(String filePath) throws IOException {
        String fileData = new String(Files.readAllBytes(Paths.get(filePath)));
        return fileData;
    }
}