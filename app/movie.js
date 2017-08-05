import { View, StyleSheet, Image, TextInput, Button, FlatList, Text, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import StarRating from 'react-native-star-rating';
const MOVIE_NORMAL = require('./images/movie_normal.png');
const MOVIE_SELECT = require('./images/movie_selected.png');

const MOVIE_SEARCH = 'https://api.douban.com/v2/movie/search?q=';
const MOVIE_TOP = 'https://api.douban.com/v2/movie/top250?start=0&count=21';

import  LineDivider  from './lineDivder.js'
import  LoadingView  from './loadingView.js'

var searchText = null;

export default class MovieScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            dataSource: null,
            loading: false
        };
    };

    static navigationOptions = {
        headerTitle: '电影',
        headerTitleStyle : {alignSelf:'center'},
        tabBarLabel: 'Movie',
        tabBarIcon: ({focused}) =>{
            return(
                <Image source={focused ? MOVIE_SELECT : MOVIE_NORMAL} style={[styles.icon]}/>
            )
        }
    }

    componentWillMount() {
        this.searchMovies(MOVIE_TOP);
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.search}>
                    <TextInput
                        editable={true}
                        maxLength={20}
                        underlineColorAndroid={'transparent'}
                        returnKeyType='search'
                        placeholder={'请输入想要搜索的电影'}
                        style={styles.input}
                        onChangeText={(text) => searchText=text}
                    />
                    <Button
                        title='搜索'
                        onPress={() =>{this.searchMovies(MOVIE_SEARCH+searchText)}}
                    />
                </View>
                {this.renderMovies()}
            </View>
        )
    }

    renderMovies() {
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
                    key={'h'}
                    numColumns={3}
                    columnWrapperStyle={
                        {flexWrap:'wrap', justifyContent:'space-around'}
                    }

                    horizontal={false}
                    keyExtractor={(item, index) => item.id}
                    ItemSeparatorComponent= { LineDivider }
                    renderItem = {({item, index}) =>
                        <TouchableOpacity onPress={()=>this.onPressItem(item, index)}>
                            <View style={styles.listContent}>
                                <Image
                                    style={styles.bookImage}
                                    source={{uri: item.images.large}}
                                />
                                {this.textCheckNull(item.title)}
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
                                    <Text style={{marginLeft:5}}>{item.rating.average}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                />
            </View>
        );
    }

    onPressItem(item, index) {
        const {navigate} = this.props.navigation;
        navigate('MovieDetail', {title:item.title, id: item.id})
    }

    textCheckNull(title) {
        if(title.length > 7) {
            title = title.substring(0, 6)+'...'
        }
        return(
            <Text numberOfLines={1} style={{fontSize:14, fontWeight:'bold'}}>{title}</Text>
        )
    }

    searchMovies(uri) {
        this.setState({
            dataSource:null,
            loading:true
        });
        this.fetchData(uri);
    }

    fetchData(uri) {
        fetch(uri)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    dataSource:responseJson.subjects,
                    loading:false
                })
            })
            .catch((error) => {
                this.setState({
                    dataSource:error,
                    loading:false
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
        // flexDirection: 'row',
        margin: 10,
        paddingTop:10,
        paddingBottom:10,
        borderRadius: 5,
        backgroundColor:'white',
    },

    // listContent: {
    //     backgroundColor:'white',
    //     borderRadius: 5,
    //     padding: 10,
    // },
    bookImage: {
        width:100,
        height: 150,
    },
});