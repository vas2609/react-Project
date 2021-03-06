import React, { PureComponent } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './toDo.module.css';
import Task from '../../Task/Task';
import Search from '../../Search/Search';
import AddTask from '../../Addtask/AddTask';
import Confirm from '../../Confirm/Confirm';
import EditTaskModal from '../../EditTaskModal/EditTaskModal';
import { connect } from 'react-redux';
import { getTasks, removeSelectid } from '../../../store/actions'



class ToDo extends PureComponent {
    state = {
        selected: new Set(),
        searchBar: false,
        showConfirm: false,
        editTask: null,
        newTaskModal: false
    };

    componentDidMount() {
        this.props.getTasks();

    }

    componentDidUpdate(prevProps) {
        if (!prevProps.addTaskSuccess && this.props.addTaskSuccess) {
            this.toggleNewTask()
        }
        if (!prevProps.removeTaskSuccess && this.props.removeTaskSuccess) {
            this.setState({
                showConfirm: false,
                selected: new Set(),
            })
        }
        if (!prevProps.editTaskSuccess && this.props.editTaskSuccess) {
            this.setState({
                editTask: null
            })
        }
    }

    handleChange = (event) => {
        this.setState({
            inputValue: event.target.value
        })
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleClick();
        }
    }

    handleCheck = (taskid) => {
        let selected = new Set(this.state.selected);
        if (selected.has(taskid)) {
            selected.delete(taskid)
        }
        else {
            selected.add(taskid)
        };
        this.setState({
            selected
        })

    };

    removeSelectid = () => {
        let selected = [...this.state.selected]
        this.props.removeSelectid(selected)

    };

    toggleConfirm = () => {
        this.setState({
            showConfirm: !this.state.showConfirm

        });
    };

    toggleEdit = (task) => {
        this.setState({
            editTask: task
        })
    };


    toggleNewTask = () => {
        this.setState({
            newTaskModal: !this.state.newTaskModal
        })

    };

    toggleSearch = () => {
        this.setState({
            searchBar: !this.state.searchBar
        })
    }

    render() {

        let { selected, showConfirm, editTask, newTaskModal, searchBar } = this.state;
        let { task } = this.props;
        let card = task.map((task) => (
            <Col key={task._id} xs={12} sm={6} md={4} lg={3} xl={3} es={6}>
                <Task
                    data={task}
                    from='tasks'
                    disabled={!!selected.size}
                    onCheck={this.handleCheck}
                    onEdit={this.toggleEdit} />

            </Col>
        ))

        return (
            <>


                <Col className={styles.toDo}>
                    <Row>

                        {
                            searchBar &&
                            <Search />

                        }

                        < Container className={styles.toDo}>
                            <Row className={'justify-content-center text-center mt-3'}>
                                <Col >
                                    <Button
                                        variant='outline-success'
                                        onClick={this.toggleNewTask}
                                        disabled={selected.size}
                                    >
                                        Add Task
                                    </Button>

                                    <Button
                                        className={styles.remuveBt}
                                        variant='outline-danger'
                                        onClick={this.toggleConfirm}
                                        disabled={!selected.size}
                                    >
                                        Remove Task
                            </Button>
                                    <Button
                                        className={styles.serchButton}
                                        variant="outline-primary"
                                        onClick={this.toggleSearch}
                                        disabled={selected.size}
                                    >
                                        <FontAwesomeIcon icon={faSearch} />
                                        Search
                                </Button>
                                </Col>
                            </Row>

                            <Row>
                                {card}
                            </Row>
                        </Container>


                        {showConfirm &&
                            < Confirm
                                onSubmit={this.removeSelectid}
                                onClose={this.toggleConfirm}
                                count={selected.size}
                            />}

                        {!!editTask &&
                            <EditTaskModal
                                data={editTask}
                                from='tasks'
                                onClose={() => { this.toggleEdit(null) }}
                            />
                        }

                        {newTaskModal &&
                            <AddTask
                                onClose={this.toggleNewTask}
                            />
                        }

                    </Row>
                </Col>
            </>
        );
    };
};

let mapStateToProps = (state) => {
    return {
        task: state.task,
        addTaskSuccess: state.addTaskSuccess,
        editTaskSuccess: state.edidTaskSuccess,
        removeTaskSuccess: state.removeTaskSuccess,
    }
}

let mapDispatchToProps = {
    getTasks,
    removeSelectid,


}

export default connect(mapStateToProps, mapDispatchToProps)(ToDo);