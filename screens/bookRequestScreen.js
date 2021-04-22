import React from "react";
import {TouchableOpacity , Text , Image , StyleSheet , View, TextInput, Alert , Modal, ScrollView , KeyboardAvoidingView } from "react-native"
import db from "../config"
import firebase from "firebase"
import MyHeader from "../component/myHeader"

export default class BookRequestScreen extends React.Component{

    constructor(){
        super()
        this.state={
            userId:firebase.auth().currentUser.email,
            bookName:"",
            reasonToRequest:"",
            requestId:"",
            bookStatus:"",
            requestedBookName:"",
            docId:"",
            isBookRequestStatusActive:""
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7);
    }

    addRequest = ()=>{
        var randomRequestId  = this.createUniqueId()
        db.collection("requested_books").add({
            user_id:this.state.userId,
            book_name:this.state.bookName,
            reason_to_request:this.state.reasonToRequest,
            request_id:randomRequestId,
            book_status:"Requested"
        })
        await this.getBookRequest()
        db.collection("users").where("email_id" , "==" , this.state.userId).get()
        .then()
        .then((snapshot)=>{
           snapshot.forEach((doc)=>{
              db.collection("users").doc(doc.id).update({
                  isBookRequestStatusActive:true
              })
           }) 
        })

        this.setState({
            bookName:"",
            reasonToRequest:""
        })

        return Alert.alert("Book Request sent Successfully")
        alert("Book Request Sent Successfully")
    }

    getIsBookRequestStatusActive (){
        db.collection("users").where("email_id" , "==" , this.state.userId)
        .onSnapshot((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    isBookRequestStatusActive: doc.data().isBookRequestStatusActive,
                    docId:doc.id
                })
            })
        })
    }

    getBookRequest=()=>{
        var bookRequest = db.collection("requested_books").where("user_id" , "==" , this.state.userId)
        .get()
        .then((snapshot)=>{
           snapshot.forEach((doc)=>{
               if (doc.data().book_status !== "recieved"){
                   this.setState({
                       requestId:doc.data().request_id,
                       requestedBookName : doc.data().book_name,
                       bookStatus : doc.data().book_status,
                       docId: doc.id
                   })
               }
           })
        }) 
    }
    

    render(){
        return(
            <View style={{flex:1}}>
                <MyHeader title={"Request Book!"} navigation = {this.props.navigation}/>
                <KeyboardAvoidingView style={styles.keyBoardStyle}>

                    <TextInput style={styles.formTextInput} placeholder={"Enter Name Of The Book"} 
                        onChangeText={(text)=>{
                            this.setState({
                                bookName:text
                        })
                        }} value={this.state.bookName}
                        />

                    
                    <TextInput style={[styles.formTextInput , {height:300} ]} placeholder={"Enter The Reason To Request The Book"} 
                        onChangeText={(text)=>{
                            this.setState({
                                reasonToRequest:text
                            })
                        }} value={this.state.reasonToRequest}
                        multiLine={true}
                        numberOfLines={8}
                        />

                        <TouchableOpacity style={styles.button} onPress={()=>{
                            this.addRequest()
                         }}>

                            <Text>
                                REQUEST
                            </Text>
                        </TouchableOpacity>

                </KeyboardAvoidingView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    keyBoardStyle : {
      flex:1,
      alignItems:'center',
      justifyContent:'center'
    },
    formTextInput:{
      width:"75%",
      height:35,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
    },
    button:{
      width:"75%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
      },
    }
  )