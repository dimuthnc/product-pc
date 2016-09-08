/*
 *  Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.w   See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */

var resources = function (page, meta) {
    return {
        js: ['libs/jquery.form.min.js', 'jquery-ui.js', 'jquery-file-upload/alertify.js',
            'jquery-file-upload/bootstrap-filestyle.js', 'notify.min.js', 'jquery-file-upload/jquery.iframe-transport.js',
            'jquery-file-upload/jquery.fileupload.js', 'jquery-file-upload/vendor/jquery.ui.widget.js',
            'bootstrap-editable.js', 'FileSaver.min.js', 'jquery.form.js','import-process-functions.js'],
        css: ['bootstrap-select.min.css', 'alertify.css', 'default.css', 'jquery-ui.css', 'font-awesome.css',
            'search.css', 'build.css','process-center-custom.css']
    };
};