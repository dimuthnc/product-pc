package org.wso2.carbon.pc.analytics.core.kpi;

import jdk.nashorn.internal.parser.JSONParser;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.openjpa.persistence.jest.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONTokener;
import org.wso2.carbon.pc.analytics.core.kpi.utils.DASConfigurationUtils;
import org.wso2.carbon.pc.analytics.core.kpi.utils.MLConfigurationUtils;
import org.wso2.carbon.registry.core.utils.RegistryUtils;




import javax.xml.stream.XMLStreamException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;

/**
 * Created by dimuth on 9/9/16.
 */
public class MLConfigRestClient {

    private static final Log log = LogFactory.getLog(MLConfigRestClient.class);

    public String predict(String varNames, String varValues, String modelId)
            throws IOException, XMLStreamException, RuntimeException,JSONException{

        if (log.isDebugEnabled()) {
            log.debug("Sending POST request to WSO2 ML, to get predicted value for a created model");
        }


        String[] varValue = varValues.substring(1,varValues.length()-1).split(",");
        String[] varName = varNames.substring(1,varNames.length()-1).split(",");


        String mlUrl = MLConfigurationUtils.getMLURL();
        RegistryUtils.setTrustStoreSystemProperties();
        HttpClient httpClient = new HttpClient();
        String requestUrl = mlUrl+ AnalyticsConfigConstants.ML_PREDICT_VAR_PATH +modelId+"/predict";

        String[] varOrder = getVariableOrder();


        String params = "[[";

        for(int k=varOrder.length-1;k>=0;k--){
           // String a =varValue[getIndex(varName,varOrder[k])];


            params = params+varValue[getIndex(varName,varOrder[k])] +",";


        }

        params=params.substring(0,params.length()-1)+"]]";


        PostMethod postRequest = new PostMethod(requestUrl);



        StringRequestEntity input = new StringRequestEntity(params, "application/json", "UTF-8");
        postRequest.setRequestEntity(input);


        postRequest.setRequestHeader("Authorization", DASConfigurationUtils.getAuthorizationHeader());


        int returnCode = httpClient.executeMethod(postRequest);



        InputStreamReader reader = new InputStreamReader((postRequest.getResponseBodyAsStream()), StandardCharsets
                .UTF_8);
        BufferedReader br = new BufferedReader(reader);
        String output;
        output = br.readLine();
        String responseMsg = output.toString();

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
    private String[] getVariableOrder() throws IOException,JSONException{
        if (log.isDebugEnabled()) {
            log.debug("Sending POST request to WSO2 ML, to get predicted value for a created model");
        }
        String mlUrl = MLConfigurationUtils.getMLURL();
        RegistryUtils.setTrustStoreSystemProperties();
        HttpClient httpClient = new HttpClient();
        String requestUrl = mlUrl+ AnalyticsConfigConstants.ML_ANALYTICS_PATH ;





        GetMethod getRequest = new GetMethod(requestUrl);





        getRequest.setRequestHeader("Authorization", DASConfigurationUtils.getAuthorizationHeader());


        int returnCode = httpClient.executeMethod(getRequest);

        InputStreamReader reader = new InputStreamReader((getRequest.getResponseBodyAsStream()), StandardCharsets
                .UTF_8);
        BufferedReader br = new BufferedReader(reader);
        String output;
        output = br.readLine();
        String responseMsg = output.toString();

        JSONTokener tokener = new JSONTokener(responseMsg);
        org.json.JSONObject finalObj = new org.json.JSONObject(tokener);
        JSONArray myarray = finalObj.getJSONArray("customizedFeatures");
        String responseVariable = finalObj.getString("responseVariable");


        ArrayList<String> varOrder= new ArrayList<String>();



        for(int i=0;i<myarray.length();i++){
            org.json.JSONObject obj = myarray.getJSONObject(i);
            if((obj.getString("include").equals("true"))&&(!obj.getString("name").equals(responseVariable))){
                varOrder.add(obj.getString("name"));
            }
        }

        String[] variableOrder = new String[varOrder.size()];
        return varOrder.toArray(variableOrder);
    }
    private int getIndex(String[] arr,String word){
        for(int x=0;x<arr.length;x++){

            if(arr[x].substring(1,arr[x].length()-1).equals(word)){
                return x;

            }

        }
        return -1;

    }


}
