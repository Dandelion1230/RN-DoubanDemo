import React, {Component} from 'react'
import { View, Text, FlatList, RefreshControl, ToastAndroid } from 'react-native'

var requestData = [];
var loadCount = 0;
export default class ViewPager extends Component{

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
        }
    }

    componentWillMount() {
        console.log('componentWillMount');
        for(let i = 0; i < 20; i++) {
            requestData.push('模拟数据'+i)
        }
    }

    render() {
        console.log('render')
        return(
            <View>
                <FlatList
                    data = {
                        requestData
                    }
                    onRefresh={() => this.requestData()}
                    refreshing={this.state.refreshing}
                    keyExtractor={(item, index) => item}
                    onEndReachedThreshold={0.1}
                    onEndReached={(info) => this.loadMoreData()}
                    renderItem = {({item, index}) =>
                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{margin:20}}>{item}</Text>
                        </View>
                    }
                />
            </View>

        )
    }

    loadMoreData() {
        loadCount+=20;
        this.setState({
            refreshing: true,
        })
        setTimeout(() => {
            for(let i = loadCount; i < (loadCount+20); i++) {
                requestData.push('模拟数据'+i)
            }
            this.setState({
                refreshing: false
            })
        }, 2000)
    }


    requestData() {
        this.setState({
            refreshing: true,
        })
        setTimeout(() => {
            for(let i = 100; i < 120; i++) {
                requestData.push('模拟数据'+i)
            }
            this.setState({
                refreshing: false
            })
        }, 2000)
    }

}