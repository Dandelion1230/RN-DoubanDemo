import React, {Component} from 'react'

import { Button, View, Text, TextInput, StyleSheet, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

var historyArray = [];
var hotArray = [];

export default class SearchScreen extends Component {

    static navigationOptions = {

        headerTitle: (
            <View style={{flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems:'center',
                marginLeft:30,
                marginRight: 10}}>
                <TextInput
                    editable={true}
                    maxLength={20}
                    underlineColorAndroid={'transparent'}
                    returnKeyType='search'
                    placeholder={'请输入想要搜索的音乐'}
                    style={{flex:1,
                        borderColor: 'gray',
                        borderWidth: 0.5,
                        height: 35,
                        padding:0,
                        paddingLeft:5,
                        paddingRight:5,
                        fontSize: 16,
                        marginRight:10}}
                    onChangeText={(text) => searchText=text}/>
                <Button
                    title='搜索'
                    onPress={() =>{this.searchMusics()}}
                />
            </View>
        ),

    }

    componentWillMount() {
        for(let i = 1; i < 10; i++) {
            historyArray.push('历史记录'+i)
        }



        for(let i = 1; i < 10; i++) {
            hotArray.push('热门搜索'+i)
        }
    }

    render() {
        // let historyViews = historyArray.map((info, i)=>(
        //     <Text style={styles.list}>{info[i]}</Text>
        // ))

        var historyViews = [];
        for (let i = 0; i < historyArray.length; i++) {
            let historyView = (
                <Text style={styles.list} key={i}>{historyArray[i]}</Text>
            )
            historyViews.push(historyView);
        }

        return(
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.list}>热门搜索</Text>
                    <View style={styles.historyViews}>
                        {historyViews}
                    </View>

                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        margin:5
    },
    historyViews: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
})