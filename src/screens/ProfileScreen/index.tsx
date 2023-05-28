import { View, Text, TextInput, StyleSheet, Button, Alert, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {MaterialIcons, FontAwesome5} from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

import { Auth } from "aws-amplify";

import { DataStore } from "aws-amplify";
import { Courier, TransportationModes } from "../../models";

import { useAuthContext } from "../../contexts/AuthContext";

const Profile = () => {
  const { dbCourier, sub, setdBCourier } = useAuthContext();
  const navigation = useNavigation();
  
  const [name, setName] = useState(dbCourier ? dbCourier.name : "");
  const [trasportationMode, setTrasportationMode] = useState(
    TransportationModes.DRIVING
    );


  const onSave = async () => {
    console.log("save")
    if(dbCourier){
      console.log("yes");
      await updateCourier();
    }
    else{
      console.log("no");
      await createCourier();
    }
  };

  const createCourier = async () =>{
    try{
      const courier = await DataStore.save(
        new Courier({
          name,
          sub,
          trasportationMode
        })
      );
        console.log("courier", courier);
        setdBCourier(courier);
    }
    catch(e) {
      console.log("error",e);
      Alert.alert("Error", e.message);
    }
  }

  const updateCourier = async ()=>{
    const courier = await DataStore.save(
      Courier.copyOf(
        dbCourier, (updated) =>{
          updated.name = name;
          updated.trasportationMode = trasportationMode
        }
      )
    );
    setdBCourier(courier);
    navigation.goBack();
  }

  return (
    <SafeAreaView>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />

      <View style={{flexDirection:'row'}}>
        <Pressable 
        onPress={()=>{setTrasportationMode(TransportationModes.BICYCLING)}}
        style={{
          backgroundColor: trasportationMode === TransportationModes.BICYCLING ?
          'lightgreen':
          "white",  
          margin:10, 
          padding:10, 
          borderWidth:1, 
          borderColor:"grey",
          borderRadius:10
          }}>
          <MaterialIcons name="pedal-bike" size={40} color="black" />
        </Pressable>
        <Pressable 
        onPress={()=>setTrasportationMode(TransportationModes.DRIVING)}
        style={{
          backgroundColor: trasportationMode === TransportationModes.DRIVING ?
           'lightgreen':
           "white", 
          margin:10, 
          padding:10, 
          borderWidth:1, 
          borderColor:"grey",
          borderRadius:10
          }}>
        <FontAwesome5 name="car" size={40} color="black" />
        </Pressable>
      </View>

      <Button onPress={onSave} title="Save" />
      <Text onPress={() => Auth.signOut()} style={{ textAlign: 'center', color: 'red', margin: 10 }}>Sign Out</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },
});

export default Profile;
