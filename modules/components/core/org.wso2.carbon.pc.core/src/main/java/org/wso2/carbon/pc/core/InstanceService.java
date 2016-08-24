package org.wso2.carbon.pc.core;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.wso2.carbon.bpmn.core.mgt.model.xsd.BPMNInstance;
import org.wso2.carbon.bpmn.core.mgt.model.xsd.BPMNVariable;
import org.wso2.carbon.governance.api.util.GovernanceUtils;
import org.wso2.carbon.pc.core.assets.Instance;
import org.wso2.carbon.pc.core.config.ProcessCenterConfiguration;
import org.wso2.carbon.pc.core.internal.ProcessCenterServerHolder;
import org.wso2.carbon.pc.core.runtime.ProcessServer;
import org.wso2.carbon.pc.core.runtime.ProcessServerImpl;
import org.wso2.carbon.registry.core.Resource;
import org.wso2.carbon.registry.core.service.RegistryService;
import org.wso2.carbon.registry.core.session.UserRegistry;
import org.wso2.carbon.utils.CarbonUtils;

import java.io.File;

/**
 * Created by dimuth on 8/23/16.
 */

public class InstanceService {

    Instance ins;
    private ProcessCenterConfiguration processCenterConfiguration;
    private ProcessServer processServer;
    private static final Log log = LogFactory.getLog(ProcessCenter.class);

    public InstanceService() {
        loadProcessCenterConfiguration();
        try {
            loadRuntimeEnvironment();
        } catch (ProcessCenterException e) {
            e.printStackTrace();
        }


        try {
            ins = new Instance(processCenterConfiguration.getRuntimeEnvironmentUsername(), processCenterConfiguration
                    .getRuntimeEnvironmentPassword(), processCenterConfiguration.getRuntimeEnvironmentURL());
        } catch (ProcessCenterException e) {
            e.printStackTrace();
        }

    }

    public String getInstanceList() {
        String instanceDetails = "{}";
        JSONArray result = new JSONArray();
        BPMNInstance[] list = new BPMNInstance[0];


            try {


                list = ins.getInstanceList();



            for (int k = 0; k < list.length; k++) {
                JSONObject jobj = new JSONObject();


                jobj.put("InstanceID", list[k].getInstanceId());
                jobj.put("ProcessName", list[k].getProcessName());
                jobj.put("ProcessID", list[k].getProcessId());
                JSONArray variableArray = new JSONArray();
                BPMNVariable[] vars = list[k].getVariables();
                if (vars != null) {

                    for (int i = 0; i < vars.length; i++) {
                        JSONObject jvarobj = new JSONObject();
                        jvarobj.put(vars[i].getName(), vars[i].getValue());
                        variableArray.put(jvarobj);

                    }

                }

                jobj.put("Variables", variableArray);


                result.put(jobj);
            }
            System.out.println(result);
            instanceDetails = result.toString();



        } catch (JSONException e) {
            e.printStackTrace();
        }
        catch (ProcessCenterException e) {
            e.printStackTrace();
        }
        return instanceDetails;
    }

    private void loadProcessCenterConfiguration() {
        if (log.isDebugEnabled()) {
            log.debug("Loading Process Center Configuration.");
        }
        if (isProcessCenterConfigurationFileAvailable()) {
            File processCenterConfigFile = new File(getProcessCenterConfigurationFilePath());
            processCenterConfiguration = new ProcessCenterConfiguration(processCenterConfigFile);
        } else {
            log.warn("Process Center configuration file: " + ProcessCenterConstants
                    .PROCESS_CENTER_CONFIGURATION_FILE_NAME +
                    " not found. Loading default configurations.");
        }
    }

    /**
     * Load Process Runtime Servers
     */
    private void loadRuntimeEnvironment() throws ProcessCenterException {
        if (log.isDebugEnabled()) {
            log.debug("Loading Process Runtime Servers.");
        }
        // load the runtime server configs from configuration
        if (processCenterConfiguration != null && processCenterConfiguration.isRuntimeEnvironmentEnabled()) {
            processServer = new ProcessServerImpl(processCenterConfiguration.getRuntimeEnvironmentURL(),
                    processCenterConfiguration.getRuntimeEnvironmentUsername(), processCenterConfiguration
                    .getRuntimeEnvironmentPassword());
        }
        // TODO: support multiple runtime enviroments
    }

    private boolean isProcessCenterConfigurationFileAvailable() {
        File processCenterConfigurationFile = new File(getProcessCenterConfigurationFilePath());
        return processCenterConfigurationFile.exists();
    }

    /**
     * @return Process Center configuration path.
     */
    private String getProcessCenterConfigurationFilePath() {
        return CarbonUtils.getCarbonConfigDirPath() + File.separator +
                ProcessCenterConstants.PROCESS_CENTER_CONFIGURATION_FILE_NAME;
    }


}

