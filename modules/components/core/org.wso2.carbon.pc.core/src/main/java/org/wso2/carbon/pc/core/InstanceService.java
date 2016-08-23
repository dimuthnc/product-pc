package org.wso2.carbon.pc.core;

import org.wso2.carbon.bpmn.core.mgt.model.xsd.BPMNInstance;
import org.wso2.carbon.pc.core.assets.Instance;

/**
 * Created by dimuth on 8/23/16.
 */

public class InstanceService {
    Instance ins;
    public InstanceService (String username, String password, String url){

        try {
            ins = new Instance(username,password,url);
        } catch (ProcessCenterException e) {
            e.printStackTrace();
        }

    }

    public BPMNInstance[] getInstanceList(){
        BPMNInstance[] list ;
        try {

            list =ins.getInstanceList();
            System.out.println(list);
            return list;

        } catch (ProcessCenterException e) {
            e.printStackTrace();
        }
        return null;

    }

}
