import React, { Component } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import AGSKDocumentService from '../service/AGSKDocumentService';
import AGSKDocumentTypeService from '../service/AGSKDocumentTypeService';
import DropdownComponent from './DropdownComponent';
import { Toast, ToastBody, ToastHeader } from 'reactstrap';
import NavBar from '../elements/navbar';
import Footer from '../elements/footer';
import UploadDownloadFileService from '../service/UploadDownloadFileService.jsx';

const maxFileSize = 104857600 //100*1024*1024

class AGSKDocument extends Component {

    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            code: '',
            docCode: '',
            nameRus: '',
            nameKaz: '',
            cancelled: false,
            
            attachedFileName: '',
            file: '',
            fileError: '',
            fileMsg: '',
            
            typeName: '',
            typeId: -1,
            types: []
        }
        
        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.handleUploadFile = this.handleUploadFile.bind(this)
        this.onFileChange = this.onFileChange.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    componentDidMount() {
        AGSKDocumentTypeService.getAll()
            .then(response => {
                this.setState({ types: response.data })
           console.log(response.data)
            })

        if (this.state.id === -1) {
            return
        }

        AGSKDocumentService.getById(this.state.id)
            .then(response => {
                let documentType = response.data.documentType
                if (documentType) {
                    this.setState({
                        code: response.data.code,
                        docCode: response.data.docCode,
                        nameRus: response.data.nameRus,                            
                        nameKaz: response.data.nameKaz,  
                        cancelled: response.data.cancelled,  
                        attachedFileName: response.data.attachedFileName,   
                        typeName: response.data.documentType.name,
                        typeId: response.data.documentType.id                            
                    })
                } else {
                    console.log(response.data.code, response.data.docCode)
                    this.setState({     
                        code: response.data.code,
                        docCode: response.data.docCode,
                        nameRus: response.data.nameRus,                            
                        nameKaz: response.data.nameKaz,  
                        cancelled: response.data.cancelled,
                        attachedFileName: response.data.attachedFileName,   
                    })
                }
            })
        
    }

    handleInputChange = (e) => {
        const target = e.target;
        const targetValue = target.type === 'checkbox' ? target.checked : target.value;
        const targetName = target.name;

        switch(targetName) {
            case 'FirstDropdown':
                this.setState({ typeId: targetValue });
                break;            
            case 'code':
                this.setState({ code: targetValue })
                break; 
            case 'docCode':
                this.setState({ docCode: targetValue })
                break;
            case 'nameRus':
                this.setState({ nameRus: targetValue })
                break;                
            case 'nameKaz':
                this.setState({ nameKaz: targetValue })
                break;                
            case 'cancelled':
                this.setState({ cancelled: targetValue })
                break;
            case 'attachedFileName':
                this.setState({ attachedFileName: targetValue })
                break;
            default:
                break;
        }
    }

    // handleInputChange = (e) => {
    //     const target = e.target;
    //     const value = target.type === 'checkbox' ? target.checked : target.value;
    //     this.setState({ typeId: value });
    // }    

    validate(values) {
        let errors = {}

        if (!values.code) {
            errors.code = 'Введите Код'
        } else if (values.code.length < 5) {
            errors.code = 'Введите как минимум 5 символов в поле Код'
        }

        
        if (!values.nameRus) {
            errors.nameRus = 'Введите наименование'
        } else if (values.nameRus.length < 5) {
            errors.nameRus = 'Введите как минимум 5 символов в поле Наименование'
        }

        return errors
    }    

    onSubmit(values) {

        let documentTypes = this.state.types.filter(type => {
            return +type.id === +this.state.typeId
        })

        let document = {
            id: this.state.id,
            code: values.code,
            docCode: values.docCode,
            nameRus: values.nameRus,
            nameKaz: values.nameKaz,
            cancelled: values.cancelled,
            attachedFileName: values.attachedFileName,
            documentType: documentTypes[0] 
        }

        if (this.state.id === -1) {
            AGSKDocumentService.create(document)
                .then(() => this.props.history.push('/agsk-documents'))
        } else {
            AGSKDocumentService.update(this.state.id, document)
                .then(() => this.props.history.push('/agsk-documents'))
        }
    }  
    
    onFileChange = (event) => {
        this.setState({
            file: event.target.files[0]
        });
    }

    handleUploadFile = (event) => {

        event.preventDefault();
        
        this.setState({fileError: '', fileMsg: ''});
    
        if(!this.state.file) {
            this.setState({fileError: 'Пожалуйста, выбирите файл.'})
            return;
        }
    
        if(this.state.file.size > maxFileSize) {
            this.setState({fileError: 'Размер выбранного файла = ' + this.state.file.size + ' byte. Он не должен превышать ' + maxFileSize + ' byte.'})
            return;
        }

        const data = new FormData();
        //using File API to get chosen file
        //let file = event.target.files[0];
        let file = this.state.file;
        let fileType = '*.docx';
        //console.log("Uploading file", file);
        data.append('file', file);
        data.append('fileType', fileType);
        data.append('description', 'Здесь можно поместить описание и передать на backend!! Пока не используется');
        //let self = this;
        //calling async Promise and handling response or error situation
        
        UploadDownloadFileService.uploadFileToServer(data)
        .then((response) => {
            console.log(response);
            this.setState({fileError: '', fileMsg: 'Файл "' + file.name + '" успешно связан с документом.' });
            this.setState({attachedFileName: file.name});
            console.log("File " + file.name + " is uploaded");
        }).catch(function (error) {
            //console.log(error);
            if (error.response) {
               console.log("Upload error. HTTP error/status code=", error.response.status);
                this.setState({fileError: 'Ошибка загрузки. HTTP error/status code = ' + error.response.status});
            } else {
               //console.log("Upload error. HTTP error/status code=", error.message);
               this.setState({fileError: 'Ошибка загрузки. HTTP error/status code = ' + error.message});
            }
        });
    };

    render() {

        let { typeId } = this.state
        return (
            <div className="wrapperFull">
                <div className="TopMenu"><NavBar/></div>
                <div className="FullPanel container-fluid">
                
                    <Toast id="displayCenter-doc">
                        <ToastHeader >Документ</ToastHeader>
                        <ToastBody>
                            <div className="">
                                <Formik
                                    initialValues={this.state}
                                    onSubmit={this.onSubmit}
                                    validateOnChange={false}
                                    validateOnBlur={false}
                                    validate={this.validate}
                                    enableReinitialize={true}
                                >
                                    {
                                        (props) => (
                                            <Form>
                                                <ErrorMessage name="code" component="div"
                                                    className="alert alert-warning" />
                                                <ErrorMessage name="nameRus" component="div"
                                                    className="alert alert-warning" />                                        
                                                
                                                <fieldset className="form-group">
                                                    <label>Тип документа</label>
                                                    <DropdownComponent name="FirstDropdown" selectableData={this.state.types} selectedId = {typeId}
                                                                       handleInputChange={this.handleInputChange}>
                                                    </DropdownComponent>
                                                </fieldset> 
                                                <fieldset className="form-group"  >
                                                    <label>Код</label>
                                                    <Field className="form-control" type="text" name="code" value={this.state.code || ''}
                                                           onChange={this.handleInputChange}/>
                                                </fieldset>
                                                <fieldset className="form-group"  >
                                                    <label>Шифр</label>
                                                    <Field className="form-control" type="text" name="docCode" component="textarea" value={this.state.docCode || ''}
                                                           onChange={this.handleInputChange}/>                                                    
                                                </fieldset>                                                                        
                                                <fieldset className="form-group">
                                                    <label>Наименование (Рус)</label>
                                                    <Field className="form-control" type="text" name="nameRus" component="textarea" value={this.state.nameRus || ''}
                                                           onChange={this.handleInputChange}/>                                                    
                                                </fieldset>
                                                <fieldset className="form-group">
                                                    <label>Наименование (Каз)</label>
                                                    <Field className="form-control" type="text" name="nameKaz" component="textarea" value={this.state.nameKaz || ''}
                                                           onChange={this.handleInputChange}/>                                                    
                                                </fieldset>
                                                <fieldset className="form-group">
                                                    <label>Отменен</label>
                                                    <Field type="checkbox" name="cancelled" component="input" checked={props.values.cancelled || false}
                                                           id="Checkbox" onChange={this.handleInputChange}/>                                                    
                                                </fieldset>
                                                <fieldset className="form-group">
                                                    <label>Связанный файл:</label>
                                                    <Field className="form-control" type="text" name="attachedFileName" value={this.state.attachedFileName || ''}
                                                           onChange={this.handleInputChange}/>                                                    
                                                </fieldset>


                                                <div className="App-intro">
                                                    <p>Связать с другим файлом:</p>
                                                    <p style={{color: 'red'}}>{this.state.fileError}</p>
                                                    <p style={{color: 'green'}}>{this.state.fileMsg}</p>
                                                    <input onChange={this.onFileChange} type="file"></input>
                                                    <button onClick={this.handleUploadFile}>Связать</button>   
                                                </div>

                                                <br></br>

                                                <button className="btn btn-success" type="submit">Сохранить</button>                                                        
                                            </Form>
                                        )
                                    }
                                </Formik>
                            </div>
                        </ToastBody>
                    </Toast>
                </div>
                <div className="FooterPanel">
                    <div><Footer/></div>
                </div>
            </div>
        )
    }    
}

export default AGSKDocument