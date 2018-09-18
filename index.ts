import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Initialize the app with a service account, granting admin privileges
admin.initializeApp()

// As an admin, the app has access to read and write all data, regardless of Security Rules
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

  // Stores the currently-being-typechecked object for error messages.
  let obj: any = null;
  export class ErrorProxy {
    public readonly Parameter: string;
    public readonly Target_Parameter: string;
    public readonly Average_Parameter: string;
    public readonly Result: string;
    public readonly Date: string;
    public readonly Time: string;
  
    public static Parse(d: string): ErrorProxy {
      return ErrorProxy.Create(JSON.parse(d));
    }
  
    public static Create(d: any, field: string = 'root'): ErrorProxy {
      
      return new ErrorProxy(d);
    }
  
    private constructor(d: any) {
      this.Parameter = d.Parameter;
      this.Target_Parameter = d.Target_Parameter;
      this.Average_Parameter = d.Average_Parameter;
      this.Result = d.Result;
      this.Date = d.Date;
      this.Time = d.Time;
    }
  }

export const setTempLatestValue = functions.database.ref('/Sensors/{sensorNode}/Temperature/{newID}/Value').onCreate(async (snapshot, context) => {
    const updatedValue = snapshot.val()
  
    // const timestamp = admin.database.ServerValue.TIMESTAMP
    return snapshot.ref.parent.parent.parent.child('Temperature Latest Value').set(updatedValue)
})

export const setHumidLatestValue = functions.database.ref('/Sensors/{sensorNode}/Humidity/{newID}/Value').onCreate(async (snapshot, context) => {
    const updatedValue = snapshot.val()
 
    
    return snapshot.ref.parent.parent.parent.child('Humidity Latest Value').set(updatedValue)
})

export const stringTimestamp = functions.database.ref('/Sensors/{sensorNode}/{sensorPara}/{newID}/timestamp').onCreate((snapshot, context) => {
    const updatedValue = JSON.stringify(snapshot.val())
    return snapshot.ref.parent.update({"Timestamp": updatedValue})
})

export const delTempLatestValue = functions.database.ref('/Sensors/{sensorNode}/Temperature/{newID}').onDelete(async (snapshot, context) => {
    return snapshot.ref.parent.parent.update({"Temperature Latest Value" : " - "})
})

export const delHumidLatestValue = functions.database.ref('/Sensors/{sensorNode}/Humidity/{newID}').onDelete(async (snapshot, context) => {
    return snapshot.ref.parent.parent.update({"Humidity Latest Value" : " - "})
})

export const calAvgTemp = functions.database.ref('/Sensors/{sensorNode}/Temperature Latest Value').onUpdate(async (snapshot, context) => {
    const updatedValue = Number(snapshot.after.val())
    const sensorNode = context.params.sensorNode
    var temp1 = 0.0, temp2 = 0.0, temp3 = 0.0, temp4 = 0.0, avgTemp = 0.0, avgTempS
    const db = admin.database()

    switch (sensorNode){
        case "Sensor_1":    temp2 = Number(await db.ref("/Sensors/Sensor_2/").once("value").then(x => {return x.child("Temperature Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            temp3 = Number(await db.ref("/Sensors/Sensor_3/").once("value").then(x => {return x.child("Temperature Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            temp4 = Number(await db.ref("/Sensors/Sensor_4/").once("value").then(x => {return x.child("Temperature Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            avgTemp = (updatedValue + temp2 + temp3 + temp4) / 4
                            avgTempS = avgTemp.toFixed(2)
        break;
        case "Sensor_2":    temp1 = Number(await db.ref("/Sensors/Sensor_1/").once("value").then(x => {return x.child("Temperature Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            temp3 = Number(await db.ref("/Sensors/Sensor_3/").once("value").then(x => {return x.child("Temperature Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            temp4 = Number(await db.ref("/Sensors/Sensor_4/").once("value").then(x => {return x.child("Temperature Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            avgTemp = (updatedValue + temp1 + temp3 + temp4) / 4
                            avgTempS = avgTemp.toFixed(2)
        break;
        case "Sensor_3":    temp1 = Number(await db.ref("/Sensors/Sensor_1/").once("value").then(x => {return x.child("Temperature Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            temp2 = Number(await db.ref("/Sensors/Sensor_2/").once("value").then(x => {return x.child("Temperature Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            temp4 = Number(await db.ref("/Sensors/Sensor_4/").once("value").then(x => {return x.child("Temperature Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            avgTemp = (updatedValue + temp1 + temp2 + temp4) / 4
                            avgTempS = avgTemp.toFixed(2)
        break;
        case "Sensor_4":    temp1 = Number(await db.ref("/Sensors/Sensor_1/").once("value").then(x => {return x.child("Temperature Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            temp2 = Number(await db.ref("/Sensors/Sensor_2/").once("value").then(x => {return x.child("Temperature Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            temp3 = Number(await db.ref("/Sensors/Sensor_3/").once("value").then(x => {return x.child("Temperature Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            avgTemp = (updatedValue + temp1 + temp2 + temp3) / 4.0
                            avgTempS = avgTemp.toFixed(2)
        break;
        default:
        break;
    }

    return snapshot.after.ref.root.update({"/Summary/Average Temperature": avgTempS})
})

export const calAvgHumid = functions.database.ref('/Sensors/{sensorNode}/Humidity Latest Value').onUpdate(async (snapshot, context) => {
    const updatedValue = Number(snapshot.after.val())
    const sensorNode = context.params.sensorNode
    var humid1 = 0.0, humid2 = 0.0, humid3 = 0.0, humid4 = 0.0, avgHumid = 0.0, avgHumidS
    const db = admin.database()

    switch (sensorNode){
        case "Sensor_1":    humid2 = Number(await db.ref("/Sensors/Sensor_2/").once("value").then(x => {return x.child("Humidity Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            humid3 = Number(await db.ref("/Sensors/Sensor_3/").once("value").then(x => {return x.child("Humidity Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            humid4 = Number(await db.ref("/Sensors/Sensor_4/").once("value").then(x => {return x.child("Humidity Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            avgHumid = (updatedValue + humid2 + humid3 + humid4) / 4
                            avgHumidS = avgHumid.toFixed(2)
        break;
        case "Sensor_2":    humid1 = Number(await db.ref("/Sensors/Sensor_1/").once("value").then(x => {return x.child("Humidity Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            humid3 = Number(await db.ref("/Sensors/Sensor_3/").once("value").then(x => {return x.child("Humidity Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            humid4 = Number(await db.ref("/Sensors/Sensor_4/").once("value").then(x => {return x.child("Humidity Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            avgHumid = (updatedValue + humid1 + humid3 + humid4) / 4
                            avgHumidS = avgHumid.toFixed(2)
        break;
        case "Sensor_3":    humid1 = Number(await db.ref("/Sensors/Sensor_1/").once("value").then(x => {return x.child("Humidity Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            humid2 = Number(await db.ref("/Sensors/Sensor_2/").once("value").then(x => {return x.child("Humidity Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            humid4 = Number(await db.ref("/Sensors/Sensor_4/").once("value").then(x => {return x.child("Humidity Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            avgHumid = (updatedValue + humid1 + humid2 + humid4) / 4
                            avgHumidS = avgHumid.toFixed(2)
        break;
        case "Sensor_4":    humid1 = Number(await db.ref("/Sensors/Sensor_1/").once("value").then(x => {return x.child("Humidity Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            humid2 = Number(await db.ref("/Sensors/Sensor_2/").once("value").then(x => {return x.child("Humidity Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            humid3 = Number(await db.ref("/Sensors/Sensor_3/").once("value").then(x => {return x.child("Humidity Latest Value").exportVal()}).catch(error =>{console.log(error)}))
                            avgHumid = (updatedValue + humid1 + humid2 + humid3) / 4.0
                            avgHumidS = avgHumid.toFixed(2)
        break;
        default:
        break;
    }

    return snapshot.after.ref.root.update({"/Summary/Average Humidity": avgHumidS})
})

export const postWaterLevel = functions.database.ref('/Sensors/Water Level').onWrite((snapshot, context) => {
    const updatedValue = snapshot.after.val()

    if (updatedValue === "Low"){
        const timestamp = new Date()
        timestamp.setHours(timestamp.getHours() + 8)
        const date = (timestamp.toDateString()).slice(4)
        const time = (timestamp.toTimeString()).slice(0,8)

        const results = 
        ErrorProxy.Create({
        "Parameter":"Water Level",
        "Target_Parameter":"Full or Normal", 
        "Average_Parameter":"Low", 
        "Result": "Water level is LOW",
        "Date": date,
        "Time": time});
        
        snapshot.after.ref.root.child("Error").push(results).then(x =>{return null})
    }
    
    return snapshot.after.ref.parent.parent.update({"/Summary/Water Level": updatedValue})
})

export const compareAvgHumid = functions.database.ref("/Summary/Average Humidity").onUpdate(async(snapshot, Context) => {
    var updateResults = ""
    var errorFlag = true

    const updatedValue = snapshot.after.val()
    if (updatedValue === " - ")  return null;

    const db = admin.database()
    const targetHumidRef = db.ref("Target Values/Target Humidity")

    const targetHumidMax = await targetHumidRef.once("value").then(x => {
    return x.child("Maximum").exportVal()
    }).catch(error =>{console.log(error)})

    const targetHumidMin = await targetHumidRef.once("value").then(x => {
        return x.child("Minimum").exportVal()
    }).catch(error =>{console.log(error)})

    const updatedValueD = parseFloat(updatedValue)

    const targetHumidMaxD = Number(targetHumidMax)
    const targetHumidMinD = Number(targetHumidMin)

    if (updatedValueD <= targetHumidMaxD && updatedValueD >= targetHumidMinD){
        updateResults = "In Range"
        errorFlag = false
    } 
    else if (updatedValueD > targetHumidMaxD)   updateResults = "Humidity is too HIGH"
    else if (updatedValueD < targetHumidMinD)   updateResults = "Humidity is too LOW"
    else updateResults = "Not Available"

    if (errorFlag){
        const humidRange = targetHumidMin + " - " + targetHumidMax
        const timestamp = new Date()
        timestamp.setHours(timestamp.getHours() + 8)
        const date = (timestamp.toDateString()).slice(4)
        const time = (timestamp.toTimeString()).slice(0,8)

        const results = 
        ErrorProxy.Create({
        "Parameter":"Humidity",
        "Target_Parameter":humidRange, 
        "Average_Parameter":updatedValue, 
        "Result":updateResults,
        "Date": date,
        "Time": time});
        
        snapshot.after.ref.root.child("Error").push(results).then(x =>{return null})
    }
    
    return snapshot.after.ref.parent.parent.update({"/Summary/Humidity Range": updateResults})
})

export const compareAvgTemp = functions.database.ref("/Summary/Average Temperature").onUpdate(async(snapshot, Context) => {
    var updateResults = ""
    var errorFlag = true

    const updatedValue = snapshot.after.val()
    if (updatedValue === " - ")  return null;

    const db = admin.database()
    const targetTempRef = db.ref("Target Values/Target Temperature")

    const targetTempMax = await targetTempRef.once("value").then(x => {
    return x.child("Maximum").exportVal()
    }).catch(error =>{console.log(error)})

    const targetTempMin = await targetTempRef.once("value").then(x => {
        return x.child("Minimum").exportVal()
    }).catch(error =>{console.log(error)})

    const updatedValueD = parseFloat(updatedValue)

    const targetTempMaxD = Number(targetTempMax)
    const targetTempMinD = Number(targetTempMin)

    if (updatedValueD <= targetTempMaxD && updatedValueD >= targetTempMinD) {
        updateResults = "In Range"
        errorFlag = false
    }
    else if (updatedValueD > targetTempMaxD)   updateResults = "Temperature is too HIGH"
    else if (updatedValueD < targetTempMinD)   updateResults = "Temperature is too LOW"
    else updateResults = "Not Available"

    if (errorFlag){
        const tempRange = targetTempMin + " - " + targetTempMax
        const timestamp = new Date()
        timestamp.setHours(timestamp.getHours() + 8)
        const date = (timestamp.toDateString()).slice(4)
        const time = (timestamp.toTimeString()).slice(0,8)

        const results = 
        ErrorProxy.Create({
        "Parameter":"Temperature",
        "Target_Parameter":tempRange, 
        "Average_Parameter":updatedValue, 
        "Result":updateResults,
        "Date": date,
        "Time": time});
        
        snapshot.after.ref.root.child("Error").push(results).then(x =>{return null})
    }

    return snapshot.after.ref.parent.parent.update({"/Summary/Temperature Range": updateResults})
})

export const compareTarHumid = functions.database.ref("/Target Values/Target Humidity").onUpdate(async(snapshot, Context) => {
    var updateResults = ""
    var errorFlag = true

    const targetHumidMax = snapshot.after.child("Maximum").val()
    const targetHumidMin = snapshot.after.child("Minimum").val()
    const avgHumidRef = await admin.database().ref("/Summary").once("value").then(x => {return x.child("Average Humidity").exportVal()}).catch(error =>{console.log(error)})
    const humidRange = targetHumidMin + " - " + targetHumidMax

    snapshot.after.ref.root.update({"/Summary/Target Humidity Range": humidRange}).then(x =>{return null}).catch(error => {console.log(error)})

    const updatedValueD = Number(avgHumidRef)
    const targetHumidMaxD = Number(targetHumidMax)
    const targethumidMinD = Number(targetHumidMin)

    if (updatedValueD <= targetHumidMaxD && updatedValueD >= targethumidMinD){
        updateResults = "In Range"
        errorFlag = false
    }
    else if (updatedValueD > targetHumidMaxD)   updateResults = "Humidity is too HIGH"
    else if (updatedValueD < targethumidMinD)   updateResults = "Humidity is too LOW"
    else updateResults = "Not Available"

    if (errorFlag){
        const timestamp = new Date()
        timestamp.setHours(timestamp.getHours() + 8)
        const date = (timestamp.toDateString()).slice(4)
        const time = (timestamp.toTimeString()).slice(0,8)

        const results = 
        ErrorProxy.Create({
        "Parameter":"Humidity",
        "Target_Parameter":humidRange, 
        "Average_Parameter":avgHumidRef, 
        "Result":updateResults,
        "Date": date,
        "Time": time});
        
        snapshot.after.ref.root.child("Error").push(results).then(x =>{return null})
    }

    return snapshot.after.ref.root.update({"/Summary/Humidity Range": updateResults})
})

export const compareTarTemp = functions.database.ref("/Target Values/Target Temperature").onUpdate(async(snapshot, Context) => {
    var updateResults = ""
    var errorFlag = true

    const targetTempMax = snapshot.after.child("Maximum").val()
    const targetTempMin = snapshot.after.child("Minimum").val()
    const avgTempRef = await admin.database().ref("/Summary").once("value").then(x => {return x.child("Average Temperature").exportVal()}).catch(error =>{console.log(error)})
    const tempRange = targetTempMin + " - " + targetTempMax

    snapshot.after.ref.root.update({"/Summary/Target Temperature Range": tempRange}).then(x =>{return null}).catch(error => {console.log(error)})

    const updatedValueD = Number(avgTempRef)
    const targetTempMaxD = Number(targetTempMax)
    const targetTempMinD = Number(targetTempMin)

    if (updatedValueD <= targetTempMaxD && updatedValueD >= targetTempMinD){
        updateResults = "In Range";
        errorFlag = false
    }
    else if (updatedValueD > targetTempMaxD)   updateResults = "Temperature is too HIGH"
    else if (updatedValueD < targetTempMinD)   updateResults = "Temperature is too LOW"
    else updateResults = "Not Available"
    
    if (errorFlag){
        const timestamp = new Date()
        timestamp.setHours(timestamp.getHours() + 8)
        const date = (timestamp.toDateString()).slice(4)
        const time = (timestamp.toTimeString()).slice(0,8)

        const results = 
        ErrorProxy.Create({
        "Parameter":"Temperature",
        "Target_Parameter":tempRange, 
        "Average_Parameter":avgTempRef, 
        "Result":updateResults,
        "Date": date,
        "Time": time});
        
        snapshot.after.ref.root.child("Error").push(results).then(x =>{return null})
    }
    
    return snapshot.after.ref.root.update({"/Summary/Temperature Range": updateResults})
})

export const checkRefreshFlag = functions.database.ref("/Refresh Control/All Sensor").onUpdate(async(snapshot, Context) => {
    const updatedValue = snapshot.after.val()
    
    if (updatedValue === "1"){
        await snapshot.after.ref.root.child('/Refresh Control/Sensor_1').set("1").then().catch(error =>{console.log(error)})
        await snapshot.after.ref.root.child('/Refresh Control/Sensor_2').set("1").then().catch(error =>{console.log(error)})
        await snapshot.after.ref.root.child('/Refresh Control/Sensor_3').set("1").then().catch(error =>{console.log(error)})
        await snapshot.after.ref.root.child('/Refresh Control/Sensor_4').set("1").then().catch(error =>{console.log(error)})
    }
    return snapshot.after.ref.root.child('/Refresh Control/All Sensor').set("0")
})

// export const getSensorValue = functions.database.ref('/Sensors/{sensorNode}/{sensorParaId}/Value/{newValueId}').onWrite((snapshot, context) => {
    // const updatedValue = snapshot.after.val()
    // const sensorNode = context.params.sensorNode
    // const sensorPara = context.params.sensorParaId
    // const timestamp = admin.database.ServerValue.TIMESTAMP

//     const db = admin.database()

//     switch (sensorPara){
//         case "Temperature":
//         const temp0 = db.ref("/Sensors/Sensor_1/Temperature/Value/")
//         const temp1 = db.ref("/Sensors/Sensor_2/Temperature/Value/")
//         const temp2 = db.ref("/Sensors/Sensor_3/Temperature/Value/")
//         const temp3 = db.ref("/Sensors/Sensor_4/Temperature/Value/")
        
//         switch (sensorNode){
//             case "Sensor_1":    arrayTemp[0] = parseFloat(updatedValue)
//                                 temp1.once("value").then(x => {const answer = x.toJSON();arrayTemp[1] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//                                 temp2.once("value").then(x => {const answer = x.toJSON();arrayTemp[2] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//                                 temp3.once("value").then(x => {const answer = x.toJSON();arrayTemp[3] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//             break;
//             case "Sensor_2":    arrayTemp[1] = parseFloat(updatedValue)
//                                 temp0.once("value").then(x => {const answer = x.toJSON();arrayTemp[0] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//                                 temp2.once("value").then(x => {const answer = x.toJSON();arrayTemp[2] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//                                 temp3.once("value").then(x => {const answer = x.toJSON();arrayTemp[3] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//             break;
//             case "Sensor_3":    arrayTemp[2] = updatedValue
//                                 temp1.once("value").then(x => {const answer = x.toJSON();arrayTemp[1] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//                                 temp0.once("value").then(x => {const answer = x.toJSON();arrayTemp[0] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//                                 temp3.once("value").then(x => {const answer = x.toJSON();arrayTemp[3] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//             break;
//             case "Sensor_4":    arrayTemp[3] = updatedValue
//                                 temp1.once("value").then(x => {const answer = x.toJSON();arrayTemp[1] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//                                 temp2.once("value").then(x => {const answer = x.toJSON();arrayTemp[2] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//                                 temp0.once("value").then(x => {const answer = x.toJSON();arrayTemp[0] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//             break;
//             default:
//         }
//         avgTemp = (arrayTemp[0] + arrayTemp[1] + arrayTemp[2] + arrayTemp[3]) / 4
//         break;

//         case "Humidity":    
//         const humid0 = db.ref("/Sensors/Sensor_1/Humidity/Value/")
//         const humid1 = db.ref("/Sensors/Sensor_2/Humidity/Value/")
//         const humid2 = db.ref("/Sensors/Sensor_3/Humidity/Value/")
//         const humid3 = db.ref("/Sensors/Sensor_4/Humidity/Value/")
        
//         switch (sensorNode){
//             case "Sensor_1":    arrayHumid[0] = parseFloat(updatedValue)
//                                 humid1.once("value").then(x => {const answer = x.toJSON();arrayHumid[1] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//                                 humid2.once("value").then(x => {const answer = x.toJSON();arrayHumid[2] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//                                 humid3.once("value").then(x => {const answer = x.toJSON();arrayHumid[3] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//             break;
//             case "Sensor_2":    arrayHumid[1] = parseFloat(updatedValue)
//                                 humid0.once("value").then(x => {const answer = x.toJSON();arrayHumid[0] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//                                 humid2.once("value").then(x => {const answer = x.toJSON();arrayHumid[2] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//                                 humid3.once("value").then(x => {const answer = x.toJSON();arrayHumid[3] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//             break;
//             case "Sensor_3":    arrayHumid[2] = updatedValue
//                                 humid1.once("value").then(x => {const answer = x.toJSON();arrayHumid[1] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//                                 humid0.once("value").then(x => {const answer = x.toJSON();arrayHumid[0] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//                                 humid3.once("value").then(x => {const answer = x.toJSON();arrayHumid[3] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//             break;
//             case "Sensor_4":    arrayHumid[3] = updatedValue
//                                 humid1.once("value").then(x => {const answer = x.toJSON();arrayHumid[1] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//                                 humid2.once("value").then(x => {const answer = x.toJSON();arrayHumid[2] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//                                 humid0.once("value").then(x => {const answer = x.toJSON();arrayHumid[0] = parseFloat(answer[ Object.keys(answer).sort().pop() ]);}).catch(error =>{console.log(error)})
//             break;
//             default:
//         }
//         avgHumid = (arrayHumid[0] + arrayHumid[1] + arrayHumid[2] + arrayHumid[3]) / 4

//         break;
//         default:
//     }

    // return snapshot.after.ref.parent.parent.parent.parent.parent.child('Summary').update({'Avg Temperature' : avgTemp.toPrecision(2), 'Avg Humidity': avgHumid.toPrecision(2)})
// })


// export const hehe = functions.database
// .ref('/Actuators').onUpdate((snapshot, context) => {
//     console.log('Success hehe!')
//     return null
// })