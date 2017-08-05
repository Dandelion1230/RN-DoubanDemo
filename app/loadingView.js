import React, {Component} from 'react'
import {View, Text} from 'react-native'

export default class LoadingView extends Component {

    render() {
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
                <Text style={{backgroundColor: 'white',width:100, height: 100,
                    textAlign: 'center', textAlignVertical : 'center', elevation: 10}}>正在加载...</Text>
            </View>
        )
    }

}