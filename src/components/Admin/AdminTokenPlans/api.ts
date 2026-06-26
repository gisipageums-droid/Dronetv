import { TokenPlan } from './App';
import { ADMIN_API, PAYMENT_API, LAMBDA } from '../../../lib/apiConfig';

const API_URL = ADMIN_API ? `${ADMIN_API}/dev` : `${LAMBDA.plansAdmin}/dev`;
const GET_API_URL = PAYMENT_API ? `${PAYMENT_API}/dev` : `${LAMBDA.plans}/dev`;

export const fetchPlans = async () => {
    try {
        const response = await fetch(GET_API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch plans');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const addUpdatePlan = async (plan: Partial<TokenPlan>) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plan: {
                    id: plan.id,
                    name: plan.name,
                    tokens: plan.tokens,
                    price: plan.price,
                    discount: plan.discount,
                    type: plan.type,
                    features: plan.features
                }
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to add/update plan');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const updateTokenPrice = async (tokenPriceINR: string) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tokenPriceINR: tokenPriceINR,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update token price');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deletePlan = async (deleteId: string) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                deleteId: deleteId,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to delete plan');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};
