package org.wso2.carbon.pc.analytics.core.kpi;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.pc.analytics.core.kpi.utils.DASConfigurationUtils;
import org.wso2.carbon.registry.core.utils.RegistryUtils;

import javax.xml.stream.XMLStreamException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

/**
 * Created by dimuth on 9/9/16.
 */
public class MLConfigRestClient {

    private static final Log log = LogFactory.getLog(MLConfigRestClient.class);

    public String predict(String params)
            throws IOException, XMLStreamException, RuntimeException {

        if (log.isDebugEnabled()) {
            log.debug("Sending POST request to WSO2 ML, to get predicted value for a created model");
        }
        String mlUrl = DASConfigurationUtils.getMLURL();
        RegistryUtils.setTrustStoreSystemProperties();
        HttpClient httpClient = new HttpClient();
        String requestUrl = mlUrl+ AnalyticsConfigConstants.ML_PREDICT_VAR_PATH ;




        PostMethod postRequest = new PostMethod(requestUrl);
        System.out.println(requestUrl);


        StringRequestEntity input = new StringRequestEntity(params, "application/json", "UTF-8");
        postRequest.setRequestEntity(input);


        postRequest.setRequestHeader("Authorization", DASConfigurationUtils.getAuthorizationHeader());

        System.out.println("URI   "+postRequest.getURI());
        int returnCode = httpClient.executeMethod(postRequest);
        System.out.println("return Code   "+returnCode);


        InputStreamReader reader = new InputStreamReader((postRequest.getResponseBodyAsStream()), StandardCharsets
                .UTF_8);
        BufferedReader br = new BufferedReader(reader);
        String output;
        output = br.readLine();
        String responseMsg = output.toString();
        System.out.println(responseMsg);
        postRequest.releaseConnection();
        if (br != null) {
            try {
                br.close();

            } catch (IOException e) {
                String errMsg = "ML Config Rest client BufferedReader close exception.";
                log.error(errMsg, e);

            }
        }
        //deal with the response
        if (returnCode == HttpStatus.SC_OK) {
            if (log.isDebugEnabled()) {
                log.debug("ML was configured with analytics configuration details.");

            }
            return responseMsg.substring(1,responseMsg.length()-1);
        } else {
            String errMsg =
                    "Failed : Sending the REST Post call to the WSO2 BPS to communicate the analytics configuration "
                            + "details to the BPS from PC\n: HTTP Error code : "
                            + returnCode;
            log.error(errMsg);
            throw new RuntimeException(responseMsg);
        }

    }
}
