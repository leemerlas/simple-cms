import React, { useState, useEffect } from "react";
import { 
    Grid, 
    IconButton,
    Button,
    Box,
    Typography,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Modal,
    Fade,
    Backdrop
} from '@mui/material'
import parse from 'html-react-parser';
import dateFormat from "dateformat"
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { RichEditorExample } from "../RichText/RichEditor";
import Nav from "../Nav/Nav";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddBoxIcon from '@mui/icons-material/AddBox';

const Home = () => {

    const [content, setContent] = useState([])
    const [loginModal, setLoginModal] = useState(false)
    const [registerModal, setRegisterModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [addModal, setAddModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [showLogin, setShowLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [contentDetails, setContentDetails] = useState({
        title: '',
        content: ''
    })

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    const editor = React.useRef(null);
    function focusEditor() {
        editor.current.focus();
    }

    const handleOpenLoginModal = () => {
        setLoginModal(true)
    }

    const handleCloseLoginModal = () => {
        setLoginModal(false)
    }

    const handleOpenRegisterModal = () => {
        setRegisterModal(true)
    }

    const handleCloseRegisterModal = () => {
        setRegisterModal(false)
    }

    const handleOpenAddModal = () => {
        setAddModal(true)
    }

    const handleCloseAddModal = () => {
        setAddModal(false)
    }

    const handleOpenDeleteModal = () => {
        setDeleteModal(true)
    }

    const handleCloseDeleteModal = () => {
        setDeleteModal(false)
    }

    const userLogin = () => {
        fetch(`http://localhost:5000/api/v1/auth`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem('token', data.token)
            setName(data.name)
            setShowLogin(false)
            setIsLoggedIn(true)
            handleCloseLoginModal()
            console.log(data);
        })
    }

    const userRegister = () => {

    }

    const getContent = () => {
        fetch(`http://localhost:5000/api/v1/posts`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then(data => {
            setContent(data)
            console.log(data);
        })
    }

    const submitContent = () => {

    }

    const addModalBody = (
        <div style={{ background: "white", maxWidth: 900, marginLeft: 'auto', marginRight: 'auto', borderRadius: 5, padding: 20, marginTop: '10vh',}}>
            <Grid container spacing={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Title"
                        defaultValue={contentDetails.title}
                        onChange={(e) => setContentDetails({...contentDetails, title: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <div
                    style={{ border: "1px solid black", minHeight: "6em", cursor: "text" }}
                    onClick={focusEditor}
                    >
                        <Editor
                            ref={editor}
                            editorState={editorState}
                            onChange={setEditorState}
                            placeholder="Write something!"
                        />
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <Button onClick={submitContent} variant="contained" fullWidth >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </div>
    )

    const editModalBody = (
        <div style={{ background: "white", maxWidth: 900, marginLeft: 'auto', marginRight: 'auto', borderRadius: 5, padding: 20, marginTop: '10vh',}}>
            <Grid container spacing={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            </Grid>
        </div>
    )

    const deleteModalBody = (
        <div style={{ background: "white", maxWidth: 400, marginLeft: 'auto', marginRight: 'auto', borderRadius: 5, padding: 20, marginTop: '20vh',}}>

        </div>
    )

    const registerModalBody = (
        <div style={{ background: "white", maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', borderRadius: 5, padding: 20, marginTop: '20vh',}}>
            <Grid container spacing={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                <span onClick={() => { handleCloseRegisterModal(); handleOpenLoginModal() }} style={{ cursor: 'pointer', marginTop: 10 }}>Already have an account? Login here</span>
            </Grid>
        </div>
    )

    const loginModalBody = (
        <div style={{ background: "white", maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', borderRadius: 5, padding: 20, marginTop: '20vh',}}>
            <Grid container spacing={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Grid item xs={7}>
                    <TextField
                        fullWidth
                        label="Email"
                        defaultValue={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Grid>
                <Grid item xs={7}>
                    <TextField
                        fullWidth
                        type='password'
                        label="Password"
                        defaultValue={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Grid>
                <Grid item xs={7}>
                    <Button onClick={userLogin} variant="contained" fullWidth >
                        Login
                    </Button>
                </Grid>
                <span onClick={() => { handleCloseLoginModal(); handleOpenRegisterModal() }} style={{ cursor: 'pointer', marginTop: 10 }}>Don't have an account? Register here</span>
            </Grid>
        </div>
    )

    useEffect(() => {
        getContent()
    }, [])

    return (
        <div>
            <Nav name={name} showLogin={showLogin} openLogin={handleOpenLoginModal} />
            <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                <Grid item xs={12} align="center">
                    <div>
                        <Modal
                            open={loginModal}
                            onClose={handleCloseLoginModal}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            closeAfterTransition
                        >
                            <Fade in={loginModal}>
                                {loginModalBody}
                            </Fade>
                        </Modal>
                    </div>
                </Grid>
                <Grid item xs={12} align="center">
                    <div>
                        <Modal
                            open={addModal}
                            onClose={handleCloseAddModal}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            closeAfterTransition
                        >
                            <Fade in={addModal}>
                                {addModalBody}
                            </Fade>
                        </Modal>
                    </div>
                </Grid>
                <Grid item xs={12} align="center">
                    <div>
                        <Modal
                            open={registerModal}
                            onClose={handleCloseRegisterModal}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            closeAfterTransition
                        >
                            <Fade in={registerModal}>
                                {registerModalBody}
                            </Fade>
                        </Modal>
                    </div>
                </Grid>
                {isLoggedIn && 
                    <Grid item xs={7}>
                        <Button onClick={handleOpenAddModal} variant="contained" startIcon={<AddBoxIcon />}>
                            Add Content
                        </Button>
                    </Grid>
                }
                {content.length > 0 &&
                    content.map((row, i) => {
                        return (
                            <Grid key={i} item xs={7}>
                                <Card style={{ padding: 20 }}>
                                    <CardHeader 
                                        title={row.title} 
                                        subheader={dateFormat(row.updatedAt, "dddd, mmmm dS, yyyy, h:MM:ss TT")}
                                        action={
                                            <div>
                                                {isLoggedIn && <IconButton>
                                                    <EditIcon />
                                                </IconButton>}
                                                {isLoggedIn && <IconButton>
                                                    <DeleteForeverIcon />
                                                </IconButton>}
                                            </div>
                                        }
                                    />
                                    <CardContent>
                                        {parse(row.content)}
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </div>
    )
}

export default Home;