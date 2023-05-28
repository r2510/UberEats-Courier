import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container:{
        backgroundColor: 'lightblue',
        flex: 1 
    },
    handleIndicator:{
        backgroundColor: 'grey',
        width: 100 
    },
    bagContainer:{ marginTop: 10, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    inLineText:{ 
        fontSize: 25, 
        letterSpacing: 1 
    },
    restaurantName:{ 
        fontSize: 25, 
        letterSpacing: 1, 
        paddingVertical: 20 
    },
    storeContainer:{ 
        flexDirection: 'row', 
        marginBottom:20, 
        alignItems:'center' 
    },
    restaurantAddress:{ 
        fontSize: 20, 
        color: 'grey', 
        fontWeight: '600', 
        letterSpacing: 0.5, 
        marginLeft:15, 
        textAlign:'center' 
    },
    container2:{ 
        borderTopWidth: 1, 
        borderColor: 'lightgrey', 
        paddingTop:20
    },
    detailsText:{ 
        fontSize:18, 
        color:'grey', 
        fontWeight:'600', 
        letterSpacing:0.5, 
        marginBottom:5
    },
    acceptOrderButton:{
        marginTop:'auto', 
        marginVertical:20, 
        marginHorizontal:10, 
        borderRadius:10
    },
    acceptButtonText:{
        color:'white', 
        paddingVertical:13, 
        fontSize:25, 
        fontWeight:'500', 
        textAlign:'center', 
        letterSpacing:0.5
    }
});