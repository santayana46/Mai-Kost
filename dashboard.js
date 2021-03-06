
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TakeInput,
  Image,
  Dimensions,
  TextInput,
  BackHandler,
  ListView,
  Animated,
  Button,
  AsyncStorage,
  StatusBar,
  TouchableHighlight,
} from 'react-native';
import * as firebase from 'firebase';
import { StackNavigator } from 'react-navigation';
import Drawer from 'react-native-drawer';
import { Container, Header, Icon, Fab, Item } from 'native-base';
import {responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; 
var{width,height}=Dimensions.get('window');

export default class Dashboard extends Component {
    static navigationOptions = {
        header : null
    };
    
    constructor(props){
      super(props);
     
      this.state = {
        user1: 'Useless placeholder' ,
        username  : '',
        password  : '',
        search    : '',
        dataSource: new ListView.DataSource({rowHasChanged : (row1, row2)=> row1 !== row2}), 
      };
      this.items =[];
    }
    closeControlPanel = () => {
      this._drawer.close();
    };
    openControlPanel = () => {
      this._drawer.open();
    };

    componentWillMount(){
      var database = firebase.database().ref("postTampil");
      database.on("child_added", (snapshot)=>{
          this.items.push({
            id : snapshot.key,
            uri : snapshot.val().uri,
            alamat : snapshot.val().alamat,
            nama : snapshot.val().namaPemilik,
            noHp : snapshot.val().no,
            deskripsi : snapshot.val().deskripsi,
            jenis : snapshot.val().jenisPenghuni,
            email : snapshot.val().email,
            status : snapshot.val().status,
            harga : snapshot.val().harga
          });
          this.setState({
            dataSource : this.state.dataSource.cloneWithRows(this.items),
          });
      });

    AsyncStorage.multiGet(["email","password"]).then((data)=>{
        var emailUser = data[0][1];
        var password = data[1][1];
        if(emailUser == null){
            //do nothing
        }
        else{
          firebase.auth().signInWithEmailAndPassword(emailUser, password).then(() => {
              var userId = firebase.auth().currentUser.uid;
            }).catch((error) => {
            alert("error " + error.message );
          });
        }
    });
  }

    cekLogin=()=>{
      const {navigate} = this.props.navigation;
      AsyncStorage.multiGet(["email","password"]).then((data)=>{
        if(data[0][1] == null){
          navigate("login");
        }
        else{
            navigate("properti");
        }
      });
    }

    search=(name)=>{
      //jika nama user kosong
       if(name==''){
     
         this.items=[];
     
         this.setState({
             dataSource: this.state.dataSource.cloneWithRows(this.items),
           });
     
       }
       //jika nama user tidak kosong
       else{
     
         this.items=[];
     
         this.setState({
          dataSource : this.state.dataSource.cloneWithRows(this.items),
           });    
     
         var userId = firebase.auth().currentUser.uid;
        // alert(userId);
        
        var database = firebase.database().ref().child("postTampil").orderByChild("alamat").startAt(name).endAt(name+"\uf8ff");
        
         //var database = firebase.database().ref().child("postTampil").orderByChild("alamat").startAt(name).endAt(name+"\uf8ff");
         //var database = firebase.database().ref("postTampil");
         
         database.on("child_added",(dataSnapshot)=>{
           alert("masuk");
          alert(JSON.stringify(dataSnapshot));  
         });
     
       }
     }

    render() {
      const {navigate} = this.props.navigation;
      return (
        <Drawer
          type="overlay"
          ref={(ref) => this._drawer = ref}
          content={
            <View style={{width : width-100, height : height, backgroundColor : '#99d6ff'}}>
                <View style={{backgroundColor: "#0066cc", height: 40, width: 500}} >
                  <Text style={{marginLeft: width/5, fontWeight: "bold",fontSize: 25,color: "black"}}> MAI KOST</Text>
                </View>
                <Image source = {require('./kost.png')} style ={{height : 60, width : 60, marginBottom :5,marginTop: 5, alignSelf : "center"}} ></Image>  
                <View style={{marginTop : 20}}>
                  <Item> 
                    <Icon onPress={()=>this.openControlPanel()} name="search" style={{color : 'black'}}/>
                      <TextInput
                        placeholder="Cari Kost"
                        style={{color : "black", height: 40, width : 250,fontSize: 19,marginLeft: 30,}} 
                      /> 
                  </Item>                
                </View>

                <View style={{marginTop: 30, flexDirection:'row', backgroundColor :'transparent'}}>
                  <Icon onPress={()=>this.openControlPanel()} name="add" style={{color : 'orange'}}/>
                    <TouchableOpacity onPress={()=>this.cekLogin()}>
                      <View style={{width: width-100, backgroundColor:"transparent"}}>
                         <Text style={{color:"black", marginLeft : 30}}>Tambah Properti</Text>
                      </View>
                    </TouchableOpacity>
                </View>

                <View style={{marginTop: 30, flexDirection:'row', backgroundColor :'transparent'}}>
                  <Icon onPress={()=>this.openControlPanel()} name="settings" style={{color : 'grey'}}/>
                    <TouchableOpacity onPress={()=>navigate('update')}>
                      <View style={{width: width-100, backgroundColor:"transparent"}}>
                         <Text style={{color:"black", marginLeft : 30}}>Update</Text>
                      </View>
                    </TouchableOpacity>
                </View>

                <View style={{marginTop: 30, flexDirection:'row', backgroundColor :'transparent'}}>
                  <Icon onPress={()=>this.openControlPanel()} name="person" style={{color : 'blue'}}/>
                    <TouchableOpacity onPress={()=>navigate('profil')}>
                      <View style={{width: width-100, backgroundColor:"transparent"}}>
                         <Text style={{color:"black", marginLeft : 30}}>Profil</Text>
                      </View>
                    </TouchableOpacity>
                </View>
  
                <View style={{marginTop : 30, flexDirection :'row', backgroundColor :'transparent'}}>
                    <Icon onPress={()=>this.openControlPanel()} name="lock" style={{color : 'green'}}/>
                      <TouchableOpacity onPress={()=>navigate('login')}>
                        <Text style={{color:"black", marginLeft : 30}}>LOGIN</Text>
                      </TouchableOpacity>
                </View>
            </View>
          }
          tapToClose={true}
          openDrawerOffset={0.2} // 20% gap on the right side of drawer
          panCloseMask={0.2}
          closedDrawerOffset={-3}
          styles={drawerStyles}
          tweenHandler={(ratio) => ({
            main: { opacity:(2-ratio)/2 }
          })}
        >

        <View style={{backgroundColor : 'white',height: height, width: width}}>

        <View >
          <View style={{backgroundColor: "#0066cc", height: 40, width: 500}}>
            <Icon onPress={()=>this.openControlPanel()} name="menu" style={{color : 'black'}}/>
              <View style={{position: "absolute", marginTop: 10}}>
                <Text style ={{ marginLeft: width/2.6,marginBottom: 50,fontWeight: "bold",fontSize: 20,color: "black"}}>
                   MAI KOST </Text>
              </View>
            
          </View>
         
            <Image source = {require('./kost.png')} style ={{height : 60, width : 90, marginBottom :5,marginTop: 5, alignSelf : "center"}} ></Image>  
             <View style={{marginTop : 20, borderColor : 'gray', borderWidth : 2}}>
                  <Item> 
                    <Icon onPress={()=>this.openControlPanel()} name="search" style={{color : 'black'}}/>
                      <TextInput
                      onChangeText={(name)=>this.search(name)}
                        placeholder="Search"
                        style={{color : "black", height: 40, width : 250,fontSize: 19,marginLeft: 30,textAlign: 'center'}} 
                      /> 
                  </Item>                
              </View>
           
        </View>
      
        <ListView
          style={{width : width, height : 100}}
          dataSource={this.state.dataSource}
          renderRow={(data) =>
           <TouchableOpacity onPress={()=>navigate("")}>
          <View style={{backgroundColor : 'white', borderBottomColor : 'black', borderBottomWidth : 1}}>
        
            <View>
              <Image source={{uri : data.uri}} style={{height : responsiveHeight(20), width : responsiveWidth(45), marginBottom :30, marginLeft: responsiveWidth(2)}} />
                <View style={{position: "absolute", right : 0, width: responsiveWidth(50),marginLeft: responsiveWidth(3)}}>
                <Text style = {{ color : 'black'}}>
                    {data.nama}
                  </Text>
                  <Text style = {{ color : 'blue'}}>
                    {data.harga}
                  </Text>
                  <Text style = {{ color : 'green'}}>
                    {data.alamat}
                  </Text>
                  <Text style={{color: "red"}}>
                    {data.jenis}
                  </Text>
              </View>
            </View>
          </View>
         </TouchableOpacity>
          }
        />
        </View>
      </Drawer>
      );
  }
    
};

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},


};
const styles = StyleSheet.create({
    search : {height: 40, 
      borderColor: 'gray', 
      width:width, 
      borderWidth: 1, 
      textAlign:"center", 
      borderRadius:5, 
      marginTop : 0,
      backgroundColor : "rgba(74, 140, 246, 0.2)",
      borderColor: "#004d4d"}
    });