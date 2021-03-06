import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { getSources } from '../../services/client';
import styles from './styles.module.scss'
import logo from '../../assets/img/news.svg'
import Modal from "../Modal/Modal";
import ContactForm from '../ContactForm';
import Search from './Search';

class Home extends PureComponent {
  state = {
    sources: [],
    allSources: [],
    openModal: false,
    openHeader: false,
  };
  
  loadSources = () => {
    getSources().then(({ sources }) => {
      if (!sources) return;
      const sourcesCut = [ ...sources ];
      sourcesCut.length = 3;
      this.setState({ sources: sourcesCut })
      this.setState({ allSources: sources })
    })
  };
  
  handleModalOpen = () => {
    this.setState({
      openModal: true,
    })
  };
  
  handleModalClose = () => {
    this.setState({
      openModal: false,
    })
  };
  
  handleHeaderOpen = () => {
    this.setState((prevState) => ({
      openHeader: !prevState.openHeader
    }))
  };
  
  componentDidMount() {
    this.loadSources()
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({ openHeader: false })
    }
  }
  
  render() {
    const { history } = this.props;
    const { openHeader, openModal, sources, allSources } = this.state;
    return (
      <>
        <header className={`${styles.header}`}>
          <div className={`${styles.wrapper} container`}>
            <div className={styles.logo}>
              <Link to='/'>
                <img src={logo} alt="logo"/>
                <h2>News App</h2>
              </Link>
            </div>
            <div className={styles.navigation}>
              <ul className={styles['navigation__desktop']}>
                { sources && sources.map(source => (
                    <li key={source.id} className={history.location.pathname === `/source/${source.id}` ? styles.active : ''}>
                      <Link to={`/source/${source.id}`}>
                        { source.name }
                      </Link>
                    </li>
                  ))
                }
              </ul>
              <button
                className={styles['contact-btn']}
                onClick={this.handleModalOpen}
              >
                Contact us
              </button>
              <button
                className={styles['hamburger-btn']}
                onClick={this.handleHeaderOpen}
              >
                <i className="ti-agenda" />
              </button>
              <Search sources={allSources} />
            </div>
          </div>
          <div className={`${styles.mobileMenu} ${openHeader ? styles['mobileMenu--is-open'] : null}`}>
            <ul>
              { sources && sources.map(source => (
                <li key={source.id} className={history.location.pathname === `/source/${source.id}` ? styles.active : ''}>
                  <Link to={`/source/${source.id}`}>
                    { source.name }
                  </Link>
                </li>))
              }
            </ul>
          </div>
        </header>
        <Modal
          open={openModal}
          onClose={this.handleModalClose}
        >
          <ContactForm />
        </Modal>
      </>
    )
  }
}

export default withRouter(Home)
