import React, { useState, useEffect } from "react";
import "./SegmentPage.css";
import axios from "axios";

const schemaOptions = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
];

function SegmentPage() {
  const apiUrl = "https://webhook.site/0236b29c-f0de-44ff-858c-869df5dbd0ca";
  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchemas, setSelectedSchemas] = useState([
    "first_name",
    "account_name",
  ]); // Initially selected schemas
  const [newSchema, setNewSchema] = useState("");
  const [availableSchemas, setAvailableSchemas] = useState([
    "first_name",
    "last_name",
    "gender",
    "age",
    "account_name",
    "city",
    "state",
  ]);
  const [jsonSegmentData, setJsonSegmentData] = useState(null);

  useEffect(() => {
    // Hide the "Add New Schema" button initially if all available schemas are selected
    if (selectedSchemas.length === availableSchemas.length) {
      setNewSchema("");
    }
  }, [selectedSchemas, availableSchemas]);

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSegmentName("");
    setSelectedSchemas([]);
    setNewSchema("");
    setJsonSegmentData(null);
  };

  const saveSegment = () => {
    if (segmentName && selectedSchemas.length > 0) {
      // Send data to the server in the desired format
      const schemaData = selectedSchemas.map((selectedSchema) => ({
        [selectedSchema]: schemaOptions.find(
          (option) => option.value === selectedSchema
        ).label,
      }));

      const segmentData = {
        segment_name: segmentName,
        schema: schemaData,
      };

      axios.post(apiUrl, JSON.stringify(segmentData)).catch((e) => {});

      console.log("segmentData", segmentData);

      closePopup(); // Close the popup after saving
    }
  };

  const cancelSegment = () => {
    closePopup();
  };

  const addNewSchema = () => {
    if (newSchema && availableSchemas.includes(newSchema)) {
      setSelectedSchemas((prevSelectedSchemas) => [
        ...prevSelectedSchemas,
        newSchema,
      ]);
      setNewSchema("");
    }
  };

  const removeSchema = (schema) => {
    setSelectedSchemas((prevSelectedSchemas) =>
      prevSelectedSchemas.filter((s) => s !== schema)
    );
  };

  const renderSchemaSelects = () => {
    return (
      <div className="schema-selects">
        {selectedSchemas.map((schema, index) => (
          <div key={index} className="form-group custom-select">
            <select
              value={schema}
              onChange={(e) => setSelectedSchemaAtIndex(e.target.value, index)}
              className="form-control"
            >
              <option value="">Add schema to segment</option>
              {availableSchemas.map((option) => (
                <option key={option} value={option}>
                  {
                    schemaOptions.find((schema) => schema.value === option)
                      .label
                  }
                </option>
              ))}
            </select>
            {index > 0 && (
              <button
                onClick={() => removeSchemaAtIndex(index)}
                className="remove-schema-button"
              >
                <i className="fa fa-minus"></i>
              </button>
            )}
          </div>
        ))}
        <div className="form-group custom-select">
          <select
            id="schemaSelect"
            value={newSchema}
            onChange={(e) => setNewSchema(e.target.value)}
            className="form-control"
          >
            <option value="">Add schema to segment</option>
            {availableSchemas.map((option) => (
              <option key={option} value={option}>
                {schemaOptions.find((schema) => schema.value === option).label}
              </option>
            ))}
          </select>
          {newSchema && (
            <button onClick={addNewSchema} className="add-schema-button">
              Add Schema
            </button>
          )}
        </div>
      </div>
    );
  };

  const setSelectedSchemaAtIndex = (value, index) => {
    setSelectedSchemas((prevSelectedSchemas) => {
      const updatedSelectedSchemas = [...prevSelectedSchemas];
      updatedSelectedSchemas[index] = value;
      return updatedSelectedSchemas;
    });
  };

  const removeSchemaAtIndex = (index) => {
    setSelectedSchemas((prevSelectedSchemas) =>
      prevSelectedSchemas.filter((_, i) => i !== index)
    );
  };

  return (
    <div>
      <div className="menu-bar">
        <div
          onClick={closePopup}
          style={{
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          <i className="fa fa-angle-left"></i> &nbsp; View Audience
        </div>
      </div>

      {showPopup && <div className="backdrop" onClick={closePopup}></div>}

      <div className="title-bar">
        {!showPopup && (
          <button onClick={openPopup} className="menu-button save-button">
            Save segment
          </button>
        )}
      </div>

      {showPopup && (
        <div className="popup active">
          <div className="popup-sidebar">
            <button onClick={closePopup} className="back-button">
              <i className="fa fa-angle-left"></i> &nbsp; Save Segment
            </button>
          </div>

          <div className="popup-content">
            <div className="form-group">
              <div className="segment-label">Enter the Name of the Segment</div>

              <input
                type="text"
                id="segmentName"
                placeholder="Name of the segment"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
                className="form-control custom-input"
              />
            </div>
            <div className="additional-info">
              To save your segment, you need to add new schemas to build the
              query.
            </div>
            <div className="traits-info">
              <div className="traits-indicator green"></div>
              <div className="traits-text">&nbsp;- User traits</div>
              <div className="traits-indicator red"></div>
              <div className="traits-text">&nbsp;- Group traits</div>
            </div>

            {renderSchemaSelects()}
          </div>

          <div className="popup-footer">
            <button onClick={cancelSegment} className="custom-success-button">
              Cancel
            </button>
            <button onClick={saveSegment} className="btn btn-primary">
              Save the Segment
            </button>
          </div>
        </div>
      )}

      {jsonSegmentData && (
        <div className="json-data">
          <h2>Segment Data (JSON Format)</h2>
          <pre>{jsonSegmentData}</pre>
        </div>
      )}
    </div>
  );
}

export default SegmentPage;
