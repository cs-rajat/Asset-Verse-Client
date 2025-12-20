import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { AuthContext } from '../providers/AuthProvider';

export default function PaymentSuccess() {
    const [params] = useSearchParams();
    const nav = useNavigate();
    const { user, refreshUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);

    const called = React.useRef(false);

    useEffect(() => {
        const confirmPayment = async () => {
            if (called.current) return;
            called.current = true;

            try {
                const sessionId = params.get('session_id');
                const pkg = params.get('package');
                const limit = params.get('limit');

                if (!sessionId || !pkg || !limit) {
                    setLoading(false);
                    return;
                }

                // Call backend to record payment
                const response = await API.post('/stripe/payment-success', {
                    transactionId: sessionId,
                    packageName: pkg,
                    employeeLimit: limit
                });

                console.log('Payment recorded:', response.data);

                // Refresh user data to get updated packageLimit
                await refreshUser();

                setSuccess(true);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        if (user) confirmPayment();
    }, [user, params, refreshUser]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center text-center">
            <div className="card w-96 bg-base-100 shadow-xl">
                <figure className="px-10 pt-10 text-6xl">
                    {loading ? '⏳' : success ? '✅' : '❌'}
                </figure>
                <div className="card-body items-center text-center">
                    <h2 className="card-title text-2xl">
                        {loading ? 'Processing Payment...' : success ? 'Payment Successful!' : 'Something went wrong'}
                    </h2>
                    <p>
                        {loading ? 'Please wait while we confirm your transaction.' : success ? 'Your package has been upgraded successfully.' : 'We could not verify your payment. Please contact support.'}
                    </p>
                    <div className="card-actions">
                        <button className="btn btn-primary" onClick={() => nav('/dashboard/hr')}>Go to Dashboard</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
