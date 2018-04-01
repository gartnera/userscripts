// ==UserScript==
// @name       vmware open console in new tab
// @namespace  http://agartner.com
// @version    0.2
// @description  opens vmrc console in new tab rather than window. also forces html5 console if html5 = true. forces external if externalConsle = true
// @match      https://vcloud.ialab.us/cloud/org/*
// @copyright  2014-2017, Alex Gartner
// ==/UserScript==

unsafeWindow.openPopoutConsole = function(vmName, vmId, vAppName, vmDevicesAvailable, buttonLabels, miscLabels, confirmationLabels, isVmrc) {
    if (!('idNameMap' in window))
    {
        window.idNameMap = {};
    }
    idNameMap[vmId] = vmName;
    if (externalConsole)
    {
        document.application.acquireMksTicket(vmName, vmId);
        unsafeWindow.mksTicketAcquired = function(vmId, host, port, vmx, ticket) {
            if (windowHandles[vmId] != null && !windowHandles[vmId].closed)
            {
                data = {"type": "ticket-acquired", "ticket": ticket};
                windowHandles[vmId].postMessage(data, "https://vcenter.dsunix.net");
            }
            else {
                var url = "https://agartner.com/mks/?host=" + host + "&port=" + port + "&name=" + btoa(idNameMap[vmId]) + "&id=" + btoa(vmId) + "&vmx=" + btoa(vmx) + "&ticket=" + btoa(ticket);
                windowHandles[vmId] = window.open(url, '', '');
            }
        }
        return;
    }
    if (windowHandles[vmId] != null && !windowHandles[vmId].closed) {
        windowHandles[vmId].focus();
        return;
    }

    var defaultConsoleWidth = 720;
    var defaultConsoleHeight = 400;

    var cssWidth = 0;
    var cssHeight = 40;

    var totalWidth = defaultConsoleWidth + cssWidth;
    var totalHeight = defaultConsoleHeight + cssHeight;

    var consoleUrl = html5 ? '/cloud/WebMKSConsole.html': '/cloud/VMRCConsole.html';

    var winHandle = window.open(consoleUrl, '', "");

    windowData.set(winHandle, {"vmName" : vmName, "vmId" : vmId, "vAppName" : vAppName, "vmDevicesAvailable" : vmDevicesAvailable, "buttonLabels" : buttonLabels, "miscLabels" : miscLabels, "confirmationLabels" : confirmationLabels});

    windowHandles[vmId] = winHandle;
}

unsafeWindow.html5 = false;
unsafeWindow.externalConsole = true;

unsafeWindow.addEventListener("message", function(ev){
    if (ev.data.type === "ticket-request"){
        document.application.acquireMksTicket(ev.data.vmName, ev.data.vmId);
    }
})