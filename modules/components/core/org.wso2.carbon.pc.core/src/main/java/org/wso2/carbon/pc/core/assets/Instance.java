package org.wso2.carbon.pc.core.assets;

import org.apache.axis2.AxisFault;
import org.apache.axis2.jaxws.util.SoapUtils;
import org.apache.taglibs.standard.tag.el.sql.SetDataSourceTag;
import org.wso2.carbon.authenticator.stub.LoginAuthenticationExceptionException;
import org.wso2.carbon.bpmn.core.mgt.model.xsd.BPMNInstance;
import org.wso2.carbon.bpmn.core.mgt.model.xsd.BPMNVariable;
import org.wso2.carbon.bpmn.stub.BPMNDeploymentServiceBPSFaultException;
import org.wso2.carbon.bpmn.stub.BPMNInstanceServiceBPSFaultException;
import org.wso2.carbon.pc.core.ProcessCenter;
import org.wso2.carbon.pc.core.ProcessCenterConstants;
import org.wso2.carbon.pc.core.ProcessCenterException;
import org.wso2.carbon.pc.core.clients.LoginAdminServiceClient;
import org.wso2.carbon.pc.core.clients.WorkflowServiceClient;
import org.wso2.carbon.pc.core.config.ProcessCenterConfiguration;
import org.wso2.carbon.pc.core.runtime.ProcessServer;
import org.wso2.carbon.pc.core.runtime.ProcessServerImpl;

import java.io.File;
import java.net.MalformedURLException;
import java.rmi.RemoteException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.utils.CarbonUtils;

/**
 * Created by dimuth on 8/23/16.
 */
public class Instance {
    BPMNInstance[] instances;
    BPMNInstance inst =new BPMNInstance();
    LoginAdminServiceClient loginServiceClient;

    String username;
    String password;
    String url;


    public Instance(String usr, String psw, String url) throws ProcessCenterException {

        this.url = url;
        this.username = usr;
        this.password = psw;
        System.out.println("Creating instance object");
        System.out.println(url);
        try {

            loginServiceClient = new LoginAdminServiceClient(this.url);
        } catch (AxisFault axisFault) {
            throw new ProcessCenterException("Error while creating Login admin service client ", axisFault);
        }
        System.out.println("object Created");


    }


    public BPMNInstance[] getInstanceList() throws ProcessCenterException {

        try {
            System.out.println("Inside the method try");
            WorkflowServiceClient workflowServiceClient = new WorkflowServiceClient(loginServiceClient.authenticate
                    (this.username, this.password.toCharArray()), this.url, null);



            instances = workflowServiceClient.getInstanceList();





            return instances;

        } catch (LoginAuthenticationExceptionException e) {
            throw new ProcessCenterException("Authentication error while undeploying bpmn package to BPS server ", e);
        } catch (MalformedURLException e) {
            throw new ProcessCenterException("Error occurred while passing server Url ", e);
        } catch (RemoteException e) {
            throw new ProcessCenterException("Error occurred undeploying bpmn package to BPS server ", e);
        } catch (BPMNInstanceServiceBPSFaultException e) {
            e.printStackTrace();

        }

        return null;
    }
}
