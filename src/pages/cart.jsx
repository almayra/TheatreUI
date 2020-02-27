import React, { Component } from 'react'
import Axios from 'axios'
import {connect} from 'react-redux'
import {Table,Modal,ModalHeader,ModalBody, ModalFooter} from 'reactstrap'
import {APIURL} from './../support/ApiURL'
import {Button} from 'semantic-ui-react'
import Numeral from 'numeral'
import {Redirect} from 'react-router-dom'


export class Cart extends Component {
    state={
        datacart:null,
        modaldetail:false,
        indexdetail:0,
        totalharga:0,
        btnCart:false,
        modalcheckout:0,
        hargacheckout:0
    }

    componentDidMount(){
        Axios.get(`${APIURL}orders?_expand=movie&userId=${this.props.userId}&bayar=false`)
        .then((res)=>{
            // this.setState({datacart:res.data})
            var datacart=res.data
            var harga=0
            for(var i=0;i<datacart.length;i++){
                harga+=datacart[i].totalharga
            }
            this.setState({totalharga:harga})
            var qtyarr=[]
            console.log('res.data',datacart)
            res.data.forEach(element=>{
                qtyarr.push(Axios.get(`${APIURL}ordersDetails?orderId=${element.id}`))
            })

            var qtyarrfinal=[]
            // console.log(qtyarr)
            Axios.all(qtyarr)
            .then((res1)=>{
                res1.forEach((val)=>{
                    qtyarrfinal.push(val.data)
                })
                console.log(qtyarrfinal)
                var datafinal=[]
                datacart.forEach((val,index)=>{
                    datafinal.push({...val,qty:qtyarrfinal[index]})
                })
                console.log(datafinal)
                this.setState({
                    datacart:datafinal
                })
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderCart=()=>{
        if(this.state.datacart!==null){
            return this.state.datacart.map((val,index)=>{
                return(
                    <tr key={index} >
                        <td style={{width:100}}> {index+1} </td>
                        <td style={{width:300}}> {val.movie.title} </td>
                        <td style={{width:100}}><button disabled className='btn btn-outline-primary'>{val.jadwal}.00</button></td>
                        <td style={{width:100, textAlign:'center'}}> {val.qty.length} </td>
                        <td style={{width:300}}>{'IDR '+Numeral(val.totalharga).format('0,0.00')}</td>
                        <td style={{width:100}}> <button onClick={()=>this.setState({modaldetail:true,indexdetail:index})} className='btn btn-info'>Details</button> </td>
                    </tr>
                )
            })
        }
    }

    totalcheckout=()=>{
        var pesanan=this.state.datacart
        for(var i=0;i<pesanan.length;i++){
            this.state.hargacheckout+=pesanan[i].totalharga
        }
        return(this.state.hargacheckout)
    }

    bayarCheckout=()=>{
        var pesanan=this.state.datacart
        for(var i=0;i<pesanan.length;i++){
            var data={
                userId:pesanan[i].userId,
                movieId:pesanan[i].movieId,
                jadwal:pesanan[i].jadwal,
                totalharga:pesanan[i].totalharga,
                bayar:true,
                id:pesanan[i].id,
            }
            var id=data.id
            Axios.put(`${APIURL}orders/${id}`,data)
            .then((res)=>{
                this.componentDidMount()
            }).catch((err)=>{
                console.log(err)
            })
        }
        this.setState({modalcheckout:false})
    }

    render() {
        if(this.props.Auth.id===''){
            return <Redirect to='/' />
        }
        if(this.props.Auth.role!=='user'){
            return <Redirect to='/notfound'/>
        }
        if(this.props.userId){
            return (
                <div>
                    <Modal isOpen={this.state.modalcheckout} toggle={()=>this.setState({modalcheckout:false,totalHargaACtion:0})} size='sm'>
                        {this.state.modalcheckout?
                        <ModalBody>
                            Total : {'IDR '+Numeral(this.totalcheckout()).format('0,0.00')}
                        </ModalBody>
                        :
                        null
                    }
                        <ModalFooter>
                            <button className='btn btn-success mt-2' onClick={this.bayarCheckout} >Pay</button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.modaldetail} toggle={()=>this.setState({modaldetail:false})} >
                        <ModalHeader>
                            Details
                        </ModalHeader>
                        <ModalBody>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Seat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.datacart!==null&&this.state.datacart.length!==0?
                                    this.state.datacart[this.state.indexdetail].qty.map((val,index)=>{
                                        return(
                                            <tr key={index}>
                                                <td>{index+1}</td>
                                                <td>{'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[val.row]+(val.seat+1)}</td>
                                            </tr>
                                        )
                                    })
                                    :
                                    null  
                                }
                                </tbody>
                            </Table>
                        </ModalBody>
                    </Modal>
                    <center className='center'>
                    <Table className='mt-3' style={{width:600,color:'white'}}>
                        <thead>
                            <tr>
                                <th style={{width:100,color:'white'}}>No.</th>
                                <th style={{width:300,color:'white'}}>Title</th>
                                <th style={{width:100,color:'white'}}>Schedule</th>
                                <th style={{width:100,color:'white'}}>Quantity</th>
                                <th style={{width:300,color:'white'}}>Price</th>
                                <th style={{width:100,color:'white'}}>Detail</th>
                            </tr>
                        </thead>
                        <tbody style={{color:'white'}}>
                            {this.renderCart()}
                        </tbody>
                    </Table>
                            <Button size='medium' animated='vertical' className='mt-3'>
                                <Button.Content hidden onClick={()=>this.setState({modalcheckout:true})} >Checkout</Button.Content>
                                <Button.Content visible>
                                    Total : {'IDR '+Numeral(this.state.totalharga).format('0,0.00')}
                                </Button.Content>
                            </Button>
                    </center>
                </div>
            )
        }else{
            return <Redirect to='/notfound'/>
        }
    }
}

const MapStateToProps=(state)=>{
    return{
        AuthLog:state.Auth.login,
        userId:state.Auth.id,
        totalharga: state.Auth.totalharga,
        Auth:state.Auth
    }
}

export default connect(MapStateToProps)(Cart)
