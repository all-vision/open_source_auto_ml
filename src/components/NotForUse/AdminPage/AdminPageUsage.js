/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import '../../styles/AdminPage/admin-page-usage.css';
import color_palette from '../Shared/ColorPalette';

export default function AdminPageUsage(props) {
  const [totalModelUsage, setTotalModelUsage] = useState(0);
  useEffect(() => {
    // Update the document title using the browser API
    let total = 0;
    props.deployed_models.forEach((model) => {
      total += Number(model.totalUsage.substring(0, model.totalUsage.length - 2));
    });
    setTotalModelUsage(total);
  });

  return (
    <div className="admin-usage-wrapper">
      <div className="admin-page-usage-header">
        <h3>Model Usage</h3>
      </div>
      <div className="bars-wrapper">
        {props.deployed_models.map((model, index) => {
          return (
            <div className="model-usage-wrapper" key={index}>
              <div
                className="model-box"
                style={{ background: color_palette[index] }}
              />
              <div className="progress-bar-wrapper">
                <div className="progress-bar-details">
                  {/* <p>{model}</p> */}
                  <p className="progress-bar-model-name">{model.modelName}</p>
                  <p className="progress-bar-usage">
                    {model.totalUsage} / 
                    {Number(model.totalUsage.substring(0, model.totalUsage.length - 2))}% Used
                  </p>
                </div>
                <progress
                  value={Number(model.totalUsage.substring(0, model.totalUsage.length - 2))}
                  className="model-usage-progress-bar"
                  max="100"
                />
              </div>
            </div>
          );
        })}
        {/* <div className="model-usage-wrapper">
          <div
            className="model-box"
            style={{ background: color_palette[0] }}
          />
          <div className="progress-bar-wrapper">
            <div className="progress-bar-details">
              <p className="progress-bar-model-name">DB Scan</p>
              <p className="progress-bar-usage">15MB / 15% Used</p>
            </div>
            <progress
              value="15"
              className="model-usage-progress-bar"
              max="100"
            />
          </div>
        </div>
        <div className="model-usage-wrapper">
          <div
            className="model-box"
            style={{ background: color_palette[1] }}
          />
          <div className="progress-bar-wrapper">
            <div className="progress-bar-details">
              <p className="progress-bar-model-name">Tree Cluster</p>
              <p className="progress-bar-usage">25MB / 25% Used</p>
            </div>
            <progress
              value="25"
              className="model-usage-progress-bar"
              max="100"
            />
          </div>
        </div>
        <div className="model-usage-wrapper">
          <div
            className="model-box"
            style={{ background: color_palette[2] }}
          />
          <div className="progress-bar-wrapper">
            <div className="progress-bar-details">
              <p className="progress-bar-model-name">Random Forest</p>
              <p className="progress-bar-usage">50MB / 50% Used</p>
            </div>
            <progress
              value="50"
              className="model-usage-progress-bar"
              max="100"
            />
          </div>
        </div> */}
      </div>
      <div className="total-model-usage-wrapper">
        <div className="total-model-usage-wrapper">
          <div className="total-progress-bar-wrapper">
            <div className="progress-bar-details progress-bar-details-total total">
              <p className="progress-bar-model-name total">Total Usage</p>
              <p className="progress-bar-usage total progress-bar-total-usage">
                {/* 90MB / 90% Used */}
                {totalModelUsage}MB / {totalModelUsage}% Used
              </p>
            </div>
            <progress
              value={totalModelUsage}
              className="total-model-usage-progress-bar"
              max="100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
// }
