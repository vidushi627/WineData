import React, { Component } from 'react';

class GammaStatistics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataset: [
        {
          "Alcohol": 3,
          "Malic Acid": 13.17,
          "Ash": 2.59,
          "Alcalinity of ash": 2.37,
          "Magnesium": 20,
          "Total phenols": 120,
          "Flavanoids": 1.65,
          "Nonflavanoid phenols": 0.68,
          "Proanthocyanins": 0.53,
          "Color intensity": 1.46,
          "Hue": 9.3,
          "OD280/OD315 of diluted wines": 0.6,
          "Unknown": 1.62,
          "Class": 1
        },
        {
          "Alcohol": 3,
          "Malic Acid": 14.13,
          "Ash": 4.1,
          "Alcalinity of ash": 2.74,
          "Magnesium": 24.5,
          "Total phenols": 96,
          "Flavanoids": 2.05,
          "Nonflavanoid phenols": 0.76,
          "Proanthocyanins": 0.56,
          "Color intensity": 1.35,
          "Hue": 9.2,
          "OD280/OD315 of diluted wines": 0.61,
          "Unknown": 1.6,
          "Class": 2
        },
        // Add more data here...
      ],
    };
  }

  calculateGamma = (item) => {
    return (item["Ash"] * item["Hue"]) / item["Magnesium"];
  }

  calculateClassWiseStats = () => {
    const classMap = new Map();
    
    this.state.dataset.forEach((item) => {
      const gamma = this.calculateGamma(item);
      const className = `Class ${item.Class}`;
      
      if (!classMap.has(className)) {
        classMap.set(className, []);
      }
      
      classMap.get(className).push(gamma);
    });

    const stats = {};
    
    for (const [className, gammaValues] of classMap) {
      const mean = gammaValues.reduce((acc, val) => acc + val, 0) / gammaValues.length;
      
      const sortedValues = [...gammaValues].sort((a, b) => a - b);
      const middle = Math.floor(sortedValues.length / 2);
      const median = sortedValues.length % 2 === 0 ? (sortedValues[middle - 1] + sortedValues[middle]) / 2 : sortedValues[middle];
      
      const modeMap = new Map();
      gammaValues.forEach((val) => {
        if (!modeMap.has(val)) {
          modeMap.set(val, 0);
        }
        modeMap.set(val, modeMap.get(val) + 1);
      });
      let mode = null;
      let maxCount = 0;
      for (const [value, count] of modeMap) {
        if (count > maxCount) {
          maxCount = count;
          mode = value;
        }
      }
      
      stats[className] = {
        mean,
        median,
        mode,
      };
    }

    return stats;
  }

  render() {
    const stats = this.calculateClassWiseStats();
    const classNames = Object.keys(stats);
    
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Measure</th>
              {classNames.map((className) => (
                <th key={className}>{className}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gamma - Mean</td>
              {classNames.map((className) => (
                <td key={className}>{stats[className].mean.toFixed(2)}</td>
              ))}
            </tr>
            <tr>
              <td>Gamma - Median</td>
              {classNames.map((className) => (
                <td key={className}>{stats[className].median.toFixed(2)}</td>
              ))}
            </tr>
            <tr>
              <td>Gamma - Mode</td>
              {classNames.map((className) => (
                <td key={className}>{stats[className].mode.toFixed(2)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default GammaStatistics;
