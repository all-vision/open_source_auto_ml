/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// import '../styles/404-page.css';
import '../../styles/404-page.css';

const mapStateToProps = (state) => {
  return {
    datasets: state.datasets,
    user: state.user,
    selectedDataset: state.selectedDataset,
  };
};

/*
* render 404 page if user tries to access a url that does not exist
* example: app.allvision/asd
*/
function PageNotFound(props) {
  return (
    <section className='page-not-found-wrapper'>
      <div className='page-not-found-content'>
        <h1 className='page-not-found-header'>404</h1>
        <p className='page-not-found-subheader'>
            This page does not exist. Please check your url.
        </p>
        {
          props.selectedDataset
            ? 
            <ul className='page-not-found-helpful-links'>
              <li className='page-not-found-helpful-links-title'>Here are some helpful links instead:</li>
              <li>
                <Link to='/datasets' className='page-not-found-link'>Your Datasets Page</Link>
              </li>
              <li>
                <Link to='/unsupervised' className='page-not-found-link'>Model Zoo</Link>
              </li>
              <li>
                <Link to='/settings' className='page-not-found-link'>Settings</Link>
              </li>
            </ul>
            :
            null
        }

      </div>
    </section>
  );
}

export default connect(mapStateToProps)(PageNotFound);