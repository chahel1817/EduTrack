import React from 'react';

const AuthButton = ({
    type = "submit",
    onClick,
    loading = false,
    disabled = false,
    children,
    id,
    className = ""
}) => {
    return (
        <button
            id={id}
            type={type}
            className={`auth2-submit-btn ${className}`}
            disabled={loading || disabled}
            onClick={onClick}
        >
            {loading ? (
                <span className="auth2-btn-spinner" />
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {children}
                </div>
            )}
        </button>
    );
};

export default AuthButton;
