/**
 *  Orvibo Switch
 *
 *  Copyright 2015 Adam Clark
 *  For any information or help please contact ad@mclark.co
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License. You may obtain a copy of the License at:
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License
 *  for the specific language governing permissions and limitations under the License.
 *
 */

import java.security.MessageDigest

preferences {
    input("serverIP", "text", title: "Node Server IP Address", description: "IP Address of the Server")
    input("deviceMac", "text", title: "Device Mac Address", description: "The MAC address of the device.")
}

metadata {
    definition (name: "Orvibo On Off Device", namespace: "smartthings-users", author: "Adam Clark") {
        capability "Switch"
    }

    simulator {}

    tiles(scale: 2) {
        multiAttributeTile(name:"switch", type: "lighting", width: 6, height: 4, canChangeIcon: true){
            tileAttribute ("device.switch", key: "PRIMARY_CONTROL") {
                attributeState "on", label:'${name}', action:"switch.off", icon:"st.switches.switch.on", backgroundColor:"#79b821", nextState:"off"
                attributeState "off", label:'${name}', action:"switch.on", icon:"st.switches.switch.off", backgroundColor:"#ffffff", nextState:"On"
            }
        }

        main "switch"
        details(["switch"])
    }

}

// parse events into attributes
def parse(String description) {


}

// handle commands
def on() {
    sendEvent(name: "switch", value: 'on')
    apiGet('/switch', [ state : 'on' ])
}

def off() {
    sendEvent(name: "switch", value: 'off')
    apiGet('/switch', [ state : 'off' ])
}

private apiGet(path, query) {

	query['mac'] = settings.deviceMac

	def result = new physicalgraph.device.HubAction(
        method:     'GET',
        path:       path,
        headers:    [
            HOST:       settings.serverIP + ':8001',
            Accept:     "*/*"
        ],
        query: query
    )

    return sendHubCommand(result)

}