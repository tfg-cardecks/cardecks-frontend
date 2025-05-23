import React from 'react';

const FormTextInput = ({
  labelFor,
  labelText,
  placeholder,
  name,
  value,
  onChange,
  errors,
  type = 'text',
  isMandatory = false, 
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={labelFor}
        className="block mb-2 text-sm font-bold text-white"
      >
        {labelText} {isMandatory && <span style={{ color: 'white' }}>*</span>}
      </label>
      <div className="flex"> 
        <input
          type={type}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
        />
      </div>
      {errors && errors[name] && (
        <p className="text-yellow-200 text-xs italic">
          {errors[name]}
        </p>
      )}
    </div>
  );
};

export default FormTextInput;