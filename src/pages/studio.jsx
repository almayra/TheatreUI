import React, { Component } from 'react';
import {connect} from 'react-redux'
// import {Table,TableBody,TableHead,TableCell,TableRow} from '@material-ui/core'
import {Modal,ModalBody,ModalFooter,ModalHeader} from 'reactstrap'
import Axios from 'axios';
import { APIURL } from '../support/ApiURL';
import { Icon, Menu, Table } from 'semantic-ui-react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Spinner } from 'reactstrap';
import {Redirect} from 'react-router-dom'


const MySwal=withReactContent(Swal)

class Managestudio extends Component {
    state = { 
        loading:true,
        datastudio:[],
        modaladd:false,
        modaledit:false,
        indexedit:0,
        iddelete:0,
     }

     componentDidMount(){
         Axios.get(`${APIURL}studios`)
         .then((res)=>{
             console.log(res.data,'datastudios')
             var data=res.data
             this.setState({datastudio:data,loading:false})
         }).catch((err)=>{
             console.log(err)
         })

     }

     onClickEditStudio=()=>{
        var studio=this.refs.editstudio.value
        var jumlahKursi=this.refs.editkursi.value
        var id=this.state.datastudio[this.state.indexedit].id
        var data={
            nama:studio,
            jumlahKursi
        }
        Axios.put(`${APIURL}studios/${id}`,data)
        .then(()=>{
            Axios.get(`${APIURL}studios`)
            .then((res)=>{
                this.setState({datastudio:res.data,modaledit:false})
            })
            .catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
     }

     onClickAddStudio=()=>{
         var studio=this.refs.studio.value
         var jumlahKursi=this.refs.kursi.value
         var data={
             nama:studio,
             jumlahKursi
         }

         console.log(studio)
         console.log(jumlahKursi)

         if(studio!=='' && jumlahKursi!==''){
            Axios.post(`${APIURL}studios`, data)
            .then((res)=>{
                console.log('res',res)
                this.setState({modaladd:false})
                window.location.reload()
            }).catch((err)=>{
                console.log(err)
            })
         }else{
             console.log('gagal')
         }
    }

    onDeleteDataClick=(index)=>{
        MySwal.fire({
            title:`Delete ${this.state.datastudio[index].nama}?`,
            icon:'question',
            showCancelButton:true,
            confirmButtonText:'Yes, please',
            cancelButtonText:'No! Why',
            reverseButtons:true
        }).then((result)=>{
            if(result.value){
                const datahapus=this.state.datastudio
                this.setState({iddelete:datahapus[index].id})
                Axios.delete(`${APIURL}studios/${this.state.iddelete}`)
                .then(()=>{
                    Axios.get(`${APIURL}studios`)
                    .then((res)=>{
                        this.setState({datastudio:res.data})
                    })
                }).catch((err)=>{
                    console.log(err)
                })
                datahapus.splice(index,1)
                MySwal.fire(
                    'Deleted!',
                    'Your studio has been deleted',
                    'success'
                )
            }else if(
                result.dismiss===Swal.DismissReason.cancel
            ){
                MySwal.fire(
                    'Cancelled',
                    '',
                    'error'
                )
            }
        })
    }

    renderstudios=()=>{
        return this.state.datastudio.map((val,index)=>{
           return(
                    <Table.Row key={index}>
                            <Table.Cell>{index+1}</Table.Cell>
                            <Table.Cell>{val.nama}</Table.Cell>
                            <Table.Cell>{val.jumlahKursi}</Table.Cell>
                            <Table.Cell>
                                <div>
                                    <button className='btn btn-primary mr-2' onClick={()=>this.setState({modaledit:true,indexedit:index})}>Edit</button>
                                    <button className='btn btn-danger' onClick={()=>this.onDeleteDataClick(index)} >Delete</button>
                                </div>
                            </Table.Cell>
                    </Table.Row>
           )
        })
        
    }

    render() { 
        if(this.props.Auth.id===''){
            return <Redirect to='/' />
        }
        if(this.props.Auth.role!=='admin'){
            return <Redirect to='/notfound' />
        }
        if(this.state.loading){
            return(
                <center className='mt-5 pt-5 center'>
                    <div>
                        <Spinner type="grow" color="dark" style={{ width: '5rem', height: '5rem' }}/>
                        <Spinner type="grow" color="light" style={{ width: '5rem', height: '5rem' }}/>
                        <Spinner type="grow" color="dark" style={{ width: '5rem', height: '5rem' }}/><br></br>
                        <Spinner type="grow" color="dark" style={{ width: '5rem', height: '5rem' }}/>
                        <Spinner type="grow" color="light" style={{ width: '5rem', height: '5rem' }}/>
                        <Spinner type="grow" color="light" style={{ width: '5rem', height: '5rem' }}/>
                        <Spinner type="grow" color="dark" style={{ width: '5rem', height: '5rem' }}/>
                    </div>
                </center>
            )
        }else
        // console.log(this.state.datastudio,'asdasdas')
        return ( 
            <div>
                <Modal isOpen={this.state.modaledit} toggle={()=>this.setState({modaledit:false})}>
                    <ModalHeader>
                        EDIT STUDIOS
                    </ModalHeader>
                    <ModalBody>
                        <input type='text' className='form-control mb-3' ref='editstudio' placeholder='Studio name'/>
                        <input type='number' className='form-control' ref='editkursi' placeholder='Seats'/>
                    </ModalBody>
                    <ModalFooter>
                        <button type="button" className="btn btn-primary" onClick={this.onClickEditStudio}>Save Change</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modaladd} toggle={()=>this.setState({modaladd:false})}>
                    <ModalHeader>
                        ADD STUDIOS
                    </ModalHeader>
                    <ModalBody>
                    <input type='text' className='form-control mb-3' ref='studio' placeholder='Studio name'/>
                    <input type='number' className='form-control' ref='kursi' placeholder='Seats'/>
                    </ModalBody>
                    <ModalFooter>
                    <button type="button" className="btn btn-primary" onClick={this.onClickAddStudio}>Submit</button>
                    </ModalFooter>
                </Modal>
                
                    <div className='tengah center'>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>No.</Table.HeaderCell>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Seats</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                    {this.renderstudios()}
                            </Table.Body>
                            <Table.Footer>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='4'>
                                    <Menu floated='right' pagination>
                                        <Menu.Item as='a' icon>
                                        <Icon name='chevron left' />
                                        </Menu.Item>
                                        <Menu.Item as='a'>1</Menu.Item>
                                        <Menu.Item as='a'>2</Menu.Item>
                                        <Menu.Item as='a' icon>
                                        <Icon name='chevron right' />
                                        </Menu.Item>
                                    </Menu>
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                        <button className='btn btn-success' style={{margin:'10px'}} onClick={()=>this.setState({modaladd:true})}> Add Data</button>
                    </div>
            </div>
         );
    }
}

const MapstateToprops=(state)=>{
    return{
        AuthLog:state.Auth.login,
        Tambcart:state.tambahcart,
        userId:state.Auth.id,
        Auth:state.Auth
    }
  }
 
export default connect(MapstateToprops)(Managestudio);