package org.wso2.carbon.pc.core.assets;

import org.apache.axis2.AxisFault;
import org.wso2.carbon.authenticator.stub.LoginAuthenticationExceptionException;
import org.wso2.carbon.bpmn.stub.BPMNDeploymentServiceBPSFaultException;
import org.wso2.carbon.pc.core.ProcessCenterException;
import org.wso2.carbon.pc.core.clients.LoginAdminServiceClient;
import org.wso2.carbon.pc.core.clients.WorkflowServiceClient;

import java.net.MalformedURLException;
import java.rmi.RemoteException;

/**
 * Created by dimuth on 8/23/16.
 */
public class Instance {
    LoginAdminServiceClient loginServiceClient;
    String username ;
    String password ;
    String url ;


    public Instance(String usr, String psw, String url) throws ProcessCenterException{
        this.url = url;
        this.username=usr;
        this.password= psw;
        System.out.println("Creating instance account");
        try {
            loginServiceClient = new LoginAdminServiceClient(this.url);
        } catch (AxisFault axisFault) {
            throw new ProcessCenterException("Error while creating Login admin service client ", axisFault);
        }

    }



    public void getInstanceList(String packageName) throws ProcessCenterException {
        try {
            WorkflowServiceClient workflowServiceClient = new WorkflowServiceClient(loginServiceClient.authenticate
                    (this.username, this.password.toCharArray()), this.url, null);
            workflowServiceClient.undeploy(packageName);

        } catch (LoginAuthenticationExceptionException e) {
            throw new ProcessCenterException("Authentication error while undeploying bpmn package to BPS server ", e);
        } catch (MalformedURLException e) {
            throw new ProcessCenterException("Error occurred while passing server Url ", e);
        } catch (BPMNDeploymentServiceBPSFaultException | RemoteException e) {
            throw new ProcessCenterException("Error occurred undeploying bpmn package to BPS server ", e);
        }
    }
}
