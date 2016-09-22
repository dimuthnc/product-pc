package org.wso2.carbon.pc.analytics.core.kpi.utils;

import static org.wso2.carbon.pc.analytics.core.kpi.internal.PCAnalyticsServerHolder.getInstance;

/**
 * Created by dimuth on 9/19/16.
 */
public class MLConfigurationUtils {

    public MLConfigurationUtils(){

    }
    public static String getMLURL(){
        return getInstance().getProcessCenter().getProcessCenterConfiguration().getMachineLearnerURL();
    }
}
