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
 */

package org.wso2.carbon.pc.analytics.core.kpi.utils;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.wso2.carbon.pc.analytics.core.kpi.AnalyticsConfigConstants;
import org.wso2.carbon.pc.analytics.core.kpi.internal.PCAnalyticsServerHolder;
import org.wso2.carbon.pc.core.ProcessCenterConstants;
import org.wso2.carbon.pc.core.ProcessCenterException;
import org.wso2.carbon.pc.core.ProcessStore;
import org.wso2.carbon.registry.core.exceptions.RegistryException;
import org.wso2.carbon.registry.core.service.RegistryService;
import org.wso2.carbon.registry.core.session.UserRegistry;

import javax.xml.bind.DatatypeConverter;
import javax.xml.transform.TransformerException;
import java.nio.charset.StandardCharsets;

import static org.wso2.carbon.pc.analytics.core.kpi.internal.PCAnalyticsServerHolder.getInstance;

/**
 * Utils file for Analytics configuration related properties
 */
public class DASConfigurationUtils {
    private static final Log log = LogFactory.getLog(DASConfigurationUtils.class);

    // Make the constructor private, since it is a utility class
    private DASConfigurationUtils() {
    }

    /**
     * Check whether analytics configurations (with DAS) is made for the respective process
     *
     * @param processName
     * @param processVersion
     * @return isDASAnalyticsConfigured
     * @throws ProcessCenterException
     */
    public static boolean isDASAnalyticsConfigured(String processName, String processVersion)
            throws ProcessCenterException {
        String processContent = null;
        ProcessStore ps = new ProcessStore();
        try {
            RegistryService registryService = PCAnalyticsServerHolder.getInstance().getRegistryService();
            if (registryService != null) {
                UserRegistry reg = registryService.getGovernanceSystemRegistry();
                String processAssetPath = ProcessCenterConstants.PROCESS_ASSET_ROOT + processName + "/" +
                        processVersion;
                org.wso2.carbon.registry.core.Resource resource = reg.get(processAssetPath);
                processContent = new String((byte[]) resource.getContent());
                Document doc = ps.stringToXML(processContent);

                Element rootElement = doc.getDocumentElement();
                Element propertiesElement = (Element) rootElement.getElementsByTagName("properties").item(0);

                if (propertiesElement.getElementsByTagName(AnalyticsConfigConstants.IS_DAS_CONFIGED_TAG).getLength() > 0
                        && propertiesElement.getElementsByTagName(AnalyticsConfigConstants.IS_DAS_CONFIGED_TAG).item(0)
                        .getTextContent().equals("true")) {
                    return true;
                } else {
                    return false;
                }
            }
        } catch (RegistryException e) {
            String errMsg = "Governance Registry access error, wile checking isDasConfigedForAnalytics";
            throw new ProcessCenterException(errMsg, e);
        } catch (Exception e) {
            String errMsg = "Registry process.rxt String to XML conversion error, wile checking " +
                    "isDasConfigedForAnalytics ";
            throw new ProcessCenterException(errMsg, e);
        }
        return false;
    }

    /**
     * Set the Property isDasConfigedForAnalytics in the process related .rxt to flag that analytics configurations
     * (with DAS) is made for the respective process
     *
     * @param processName
     * @param processVersion
     * @throws ProcessCenterException
     */
    public static void setPropertyDASAnalyticsConfigured(String processName, String processVersion)
            throws ProcessCenterException {
        String processContent = null;
        ProcessStore ps = new ProcessStore();
        try {
            RegistryService registryService = PCAnalyticsServerHolder.getInstance().getRegistryService();
            if (registryService != null) {
                UserRegistry reg = registryService.getGovernanceSystemRegistry();
                String processAssetPath = ProcessCenterConstants.PROCESS_ASSET_ROOT + processName + "/" +
                        processVersion;
                org.wso2.carbon.registry.core.Resource resource = reg.get(processAssetPath);
                processContent = new String((byte[]) resource.getContent());
                Document doc = ps.stringToXML(processContent);

                Element rootElement = doc.getDocumentElement();
                Element propertiesElement = (Element) rootElement.getElementsByTagName("properties").item(0);

                //add a new property item element if it is not existing already
                if (propertiesElement.getElementsByTagName(AnalyticsConfigConstants.IS_DAS_CONFIGED_TAG).getLength()
                        == 0) {
                    ps.appendText(doc, propertiesElement, AnalyticsConfigConstants.IS_DAS_CONFIGED_TAG,
                            ProcessCenterConstants.MNS, "true");

                    String newProcessContent = ps.xmlToString(doc);
                    resource.setContent(newProcessContent);
                    reg.put(processAssetPath, resource);

                    if (log.isDebugEnabled()) {
                        log.debug("isDasConfigedForAnalytics property in process.rxt set as true");
                    }
                }
            }
        } catch (TransformerException | RegistryException e) {
            String errMsg = "Exception in setting property isDASAnalyticsConfigured in process.rxt for the process:"
                    + processName + ":" + processVersion;
            log.error(errMsg, e);
            throw new ProcessCenterException(errMsg, e);
        } catch (Exception e) {
            String errMsg =
                    "Exception in setting property isDASAnalyticsConfigured in process.rxt while converting xml to " +
                            "string for the process:"
                            + processName + ":" + processVersion;
            log.error(errMsg, e);
            throw new ProcessCenterException(errMsg, e);
        }
    }

    /**
     * Get Analytics Server URL
     *
     * @return DASUrl
     */
    public static String getDASURL() {
        return getInstance().getProcessCenter().getProcessCenterConfiguration().getAnalyticsServerURL();
    }

    /**
     * Get Runtime Server URL
     *
     * @return BPS runtime url
     */
    public static String getBPSURL() {
        return getInstance().getProcessCenter().getProcessCenterConfiguration().getRuntimeEnvironmentURL();
    }

    /**
     * Get authorization header for access bps admin service
     *
     * @return AuthorizationHeader
     */
    public static String getAuthorizationHeader() {
        String userName = getInstance().getProcessCenter().getProcessCenterConfiguration()
                .getRuntimeEnvironmentUsername();
        String password = getInstance().getProcessCenter().getProcessCenterConfiguration()
                .getRuntimeEnvironmentPassword();
        if (userName != null && password != null) {
            return AnalyticsConfigConstants.REQUEST_HEADER_BASIC + " " + DatatypeConverter.printBase64Binary(
                    (userName + ":" + password).getBytes(StandardCharsets.UTF_8));
        }
        return null;
    }

    /**
     * Get DAS user name
     *
     * @return dasUserName
     */
    public static String getDASUserName() {
        return getInstance().getProcessCenter().getProcessCenterConfiguration().getAnalyticsServerUsername();
    }

    /**
     * Get DAS Password
     *
     * @return dasPassword
     */
    public static String getDASPassword() {
        return getInstance().getProcessCenter().getProcessCenterConfiguration().getAnalyticsServerPassword();
    }
}