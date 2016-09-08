app.dependencies = ['publisher-common'];
app.server = function(ctx) {
    return {
        endpoints: {
            pages: [{
                title: 'Publisher | Servicex Page',
                url: 'servicex_global',
                path: 'servicex_global.jag'
            }, {
                title: 'Publisher | Servicex Splash page',
                url: 'splash',
                path: 'servicex_splash.jag'
            }]
        },
        configs:{
            title : "WSO2 Process Center - Designer",
            landingPage:'/assets/process/list',
            disabledAssets:['gadget','site','ebook', 'api', 'wsdl', 'service','policy','proxy','schema','sequence','servicex','uri','wadl','endpoint','swagger','restservice','comments','soapservice']
        }
    }
};