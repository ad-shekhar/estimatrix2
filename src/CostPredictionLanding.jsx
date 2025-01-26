import React, { useState } from 'react';
import { FileUp, Calculator, AlertTriangle, Clock, Users, Truck, HardHat, MapPin, Home } from 'lucide-react';

const LOCATION_COST_MULTIPLIERS = {
  'Mumbai': 1.3,
  'Delhi': 1.2,
  'Bangalore': 1.25,
  'Chennai': 1.15,
  'Hyderabad': 1.1,
  'Pune': 1.2,
  'Kolkata': 1.05,
  'Other': 1.0
};

const CostPredictionLanding = () => {
  const [floorPlan, setFloorPlan] = useState(null);
  const [projectDetails, setProjectDetails] = useState({
    area: '',
    location: '',
    estimatedCost: null,
    constructionTime: null,
    labourRequired: null,
    riskAnalysis: null
  });
  const [stage, setStage] = useState('upload');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFloorPlan(URL.createObjectURL(file));
      setStage('area');
    }
  };

  const calculateProjectEstimates = (area, location) => {
    const baseRates = {
      materialCostPerSqFt: 3000,
      labourCostPerSqFt: 1500,
      transportationCostPerSqFt: 300,
      overheadPerSqFt: 200
    };

    const locationMultiplier = LOCATION_COST_MULTIPLIERS[location] || 1.0;

    const materialCost = Math.floor(area * baseRates.materialCostPerSqFt * locationMultiplier);
    const labourCost = Math.floor(area * baseRates.labourCostPerSqFt * locationMultiplier);
    const transportationCost = Math.floor(area * baseRates.transportationCostPerSqFt * locationMultiplier);
    const overheadCost = Math.floor(area * baseRates.overheadPerSqFt * locationMultiplier);

    const totalCost = materialCost + labourCost + transportationCost + overheadCost;
    
    const constructionTimeMonths = Math.ceil(area / 500);
    const labourRequired = Math.ceil(area / 250);

    const riskAnalysis = [
      {
        title: "Material Price Volatility",
        severity: "Medium",
        description: "Potential fluctuations in material costs could impact budget"
      },
      {
        title: "Labour Availability",
        severity: "Low",
        description: "Skilled labour might be challenging to source consistently"
      },
      {
        title: "Regulatory Compliance",
        severity: "High",
        description: "Local building codes and permits may cause delays"
      },
      {
        title: "Weather Disruptions",
        severity: "Medium",
        description: "Seasonal changes could potentially extend project timeline"
      }
    ];

    return {
      totalCost,
      costBreakdown: {
        materialCost,
        labourCost,
        transportationCost,
        overheadCost
      },
      constructionTime: constructionTimeMonths,
      labourRequired,
      riskAnalysis
    };
  };

  const handleAreaChange = (event) => {
    const area = parseFloat(event.target.value);
    setProjectDetails(prev => ({
      ...prev,
      area
    }));
  };

  const handleLocationChange = (event) => {
    const location = event.target.value;
    const estimates = calculateProjectEstimates(projectDetails.area, location);
    setProjectDetails(prev => ({
      ...prev,
      location,
      ...estimates
    }));
    setStage('results');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">Construction Cost Predictor</h1>
          <p className="text-gray-600">Comprehensive Project Estimation</p>
        </header>

        <div className="bg-white shadow-lg rounded-lg p-8">
          {stage === 'upload' && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Upload Floor Plan</h2>
              <input 
                type="file" 
                accept=".jpg,.jpeg,.png,.pdf" 
                onChange={handleFileUpload}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          {stage === 'area' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Enter Project Details</h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Enter Project Area (sq ft)</label>
                <input 
                  type="number" 
                  placeholder="Total project area" 
                  onChange={handleAreaChange}
                  className="w-full p-2 border rounded"
                />
                <button 
                  onClick={() => setStage('location')}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {stage === 'location' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Select Location</h2>
              <select 
                onChange={handleLocationChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Location</option>
                {Object.keys(LOCATION_COST_MULTIPLIERS).map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          )}

          {stage === 'results' && projectDetails.totalCost && (
            <div className="space-y-8">
              {/* Total Cost Section */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Calculator className="mr-2 text-green-600" /> Total Cost Breakdown</h2>
                
                <div className="bg-blue-100 p-4 rounded mb-4">
                  <p className="text-xl font-bold text-blue-800">Total Project Cost</p>
                  <p className="text-3xl font-extrabold text-green-700">
                    ₹{projectDetails.totalCost.toLocaleString()}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-100 p-3 rounded flex flex-col items-start">
                    <Truck className="text-blue-500 mb-2" />
                    <p className="font-semibold">Material Cost</p>
                    <p>₹{projectDetails.costBreakdown.materialCost.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-gray-100 p-3 rounded flex flex-col items-start">
                    <HardHat className="text-green-500 mb-2" />
                    <p className="font-semibold">Labour Cost</p>
                    <p>₹{projectDetails.costBreakdown.labourCost.toLocaleString()}</p>
                  </div>

                  <div className="bg-gray-100 p-3 rounded flex flex-col items-start">
                    <MapPin className="text-red-500 mb-2" />
                    <p className="font-semibold">Transportation</p>
                    <p>₹{projectDetails.costBreakdown.transportationCost.toLocaleString()}</p>
                  </div>

                  <div className="bg-gray-100 p-3 rounded flex flex-col items-start">
                    <Home className="text-purple-500 mb-2" />
                    <p className="font-semibold">Overhead</p>
                    <p>₹{projectDetails.costBreakdown.overheadCost.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Project Insights */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Clock className="mr-2 text-blue-600" /> Project Insights</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-3 rounded flex flex-col items-start">
                    <Clock className="text-blue-500 mb-2" />
                    <p className="font-semibold">Construction Time</p>
                    <p>{projectDetails.constructionTime} months</p>
                  </div>
                  
                  <div className="bg-gray-100 p-3 rounded flex flex-col items-start">
                    <Users className="text-green-500 mb-2" />
                    <p className="font-semibold">Labour Required</p>
                    <p>{projectDetails.labourRequired} workers</p>
                  </div>
                </div>
              </div>

              {/* Risk Analysis */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <AlertTriangle className="mr-2 text-red-600" /> Risk Analysis</h2>
                
                <div className="space-y-3">
                  {projectDetails.riskAnalysis.map((risk, index) => (
                    <div key={index} className="bg-gray-100 p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">{risk.title}</p>
                        <span className={`
                          px-2 py-1 rounded text-xs
                          ${risk.severity === 'High' ? 'bg-red-200 text-red-800' : 
                            risk.severity === 'Medium' ? 'bg-yellow-200 text-yellow-800' : 
                            'bg-green-200 text-green-800'}
                        `}>
                          {risk.severity}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{risk.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CostPredictionLanding;