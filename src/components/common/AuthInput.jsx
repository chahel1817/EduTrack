import React from 'react';

const AuthInput = ({
    id,
    label,
    icon: Icon,
    type = "text",
    placeholder,
    value,
    onChange,
    required = false,
    autoComplete,
    rightElement
}) => {
    return (
        <div className="auth2-field">
            <div className="auth2-label-row">
                {label && <label className="auth2-label" htmlFor={id}>{label}</label>}
                {rightElement}
            </div>
            <div className="auth2-input-wrap">
                {Icon && <Icon className="auth2-input-icon" size={17} />}
                <input
                    id={id}
                    className={`auth2-input ${rightElement || type === 'password' ? 'auth2-input--pad-right' : ''}`}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    required={required}
                />
                {type === 'password' && !rightElement && (
                    <div className="auth2-eye-placeholder"></div>
                )}
            </div>
        </div>
    );
};

export default AuthInput;
