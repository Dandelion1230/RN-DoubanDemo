import React, { Component } from 'react'
import { Button, StyleSheet, Image, TextInput, View, Text, TouchableOpacity, FlatList} from 'react-native'
import StarRating from 'react-native-star-rating';
const BOOK_NORMAL = require('./images/book_normal.png');
const BOOK_SELECT = require('./images/book_selected.png');

const BOOK_URL = 'https://api.douban.com/v2/book/search?tag=文学';
const BOOK_SEARCH = 'https://api.douban.com/v2/book/search?q=';

import  LineDivider  from './lineDivder.js'
import  LoadingView  from './loadingView.js'


var searchText = null;

export default class BookScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            dataSource: null,
            loading: false,
            refreshing: false
        };
    };

    componentWillMount() {
        this.searchBooks(BOOK_URL)
    }

    static navigationOptions = ({navigation, screenProps}) => ({
        headerTitle: '书籍',
        headerTitleStyle : {alignSelf:'center'},
        tabBarLabel: 'Book',
        tabBarIcon: (({focused}) =>{
            return (
                <Image source={focused ? BOOK_SELECT:BOOK_NORMAL} style={[styles.icon]}/>
            )
        })
    });

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.search}>
                    <TextInput
                        editable={true}
                        maxLength={20}
                        underlineColorAndroid={'transparent'}
                        returnKeyType='search'
                        placeholder={'请输入想要搜索的图书'}
                        style={styles.input}
                        onChangeText={(text) => searchText = text}
                    />
                    <Button
                        title='搜索 '
                        onPress={() =>{this.searchBooks(BOOK_SEARCH+searchText)}}
                    />
                </View>
                {this.renderBooks()}
            </View>
        )
    }

    renderBooks() {
        if(this.state.loading) {
            return(
                <LoadingView/>
            )
        }
        if(!this.state.dataSource) {
            return(
                <View style={{flex:1, justifyContent:'center'}}>
                    <Text style={{alignSelf:'center'}}>
                        暂无内容
                    </Text>
                </View>
            )
        }
        return(
            <View style={styles.list}>
                <FlatList
                    data = {
                        this.state.dataSource
                    }
                    onPress={() => this.onPressItem()}
                    onRefresh={() => this.searchBooks(BOOK_URL)}
                    refreshing={this.state.refreshing}
                    keyExtractor={(item, index) => item.id}
                    ItemSeparatorComponent= { LineDivider }
                    renderItem = {({item, index}) =>
                        <TouchableOpacity onPress={() => this.onPressItem(item, index)}>
                            <View style={styles.listContent}>
                                <Image
                                    style={styles.bookImage}
                                    source={{uri: item.image}}
                                />
                                <View style={styles.listRight}>
                                    <Text numberOfLines={1} style={{fontSize:16, fontWeight:'bold'}}>{item.title}</Text>
                                    <Text numberOfLines={1}>作者：{item.author}</Text>
                                    {this.textCheckNull(item.translator[0])}
                                    <Text numberOfLines={1}>价格：{item.price}</Text>
                                    <Text numberOfLines={1}>出版社：{item.publisher}</Text>
                                    <Text numberOfLines={1}>出版日期：{item.pubdate}</Text>
                                    <View style={{flexDirection:'row'}}>
                                        <StarRating
                                            disabled={true}
                                            maxStars={5}
                                            emptyStar={'ios-star-outline'}
                                            fullStar={'ios-star'}
                                            halfStar={'ios-star-half'}
                                            iconSet={'Ionicons'}
                                            rating={item.rating.average/2}
                                            starColor={'#FABD3B'}
                                            emptyStarColor={'#FABD3B'}
                                            starSize={18}
                                        />
                                        <Text style={{marginLeft:10}}>{item.rating.average}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                />
            </View>
        );
    }

    /**
     * item的点击事件
     */
    onPressItem(item, index) {
        const {navigate} = this.props.navigation;
        navigate('BookDetail', {title:item.title, id: item.id})
    }

    searchBooks(uri) {
        this.setState({
            dataSource:null,
            loading:true,
            refreshing: true
        });
        this.fetchData(uri);
    }


    textCheckNull(translator) {
        if(!translator) {
            return null;
        }
        return(
            <Text numberOfLines={1}>译者：{translator}</Text>
        )
    }

    fetchData(uri) {
        fetch(uri)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    dataSource:responseJson.books,
                    loading:false,
                    refreshing: false,
                })
            })
            .catch((error) => {
                this.setState({
                    dataSource:error,
                    loading:false,
                    refreshing: false,
                })
            });
    }
}





const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    search: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        padding:10,
        paddingBottom:0
    },
    icon: {
        width: 30,
        height: 30,
    },
    input: {
        flex:1,
        borderColor: 'gray',
        borderWidth: 0.5,
        height: 35,
        padding:0,
        paddingLeft:5,
        paddingRight:5,
        fontSize: 16,
        marginRight:5
    },
    list: {
        flex: 1,
        padding: 10,
    },
    listContent: {
        flexDirection:'row',
        backgroundColor:'white',
        borderRadius: 5,
        padding: 10,
    },
    bookImage: {
        width:100,
        height: 150,
    },
    listRight: {
        flex: 1,
        marginLeft:5,
        justifyContent:'space-between'
    }
});