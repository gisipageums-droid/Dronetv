import { TokenPlan } from './App';

const API_URL = 'https://i8hkp4rc47.execute-api.ap-south-1.amazonaws.com/prod/dev';
const GET_API_URL = 'https://m6iy4nsz94.execute-api.ap-south-1.amazonaws.com/prod/dev';

export const fetchPlans = async () => {
    try {
        const response = await fetch(GET_API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch plans');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching plans:', error);
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
        console.error('Error adding/updating plan:', error);
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
        console.error('Error updating token price:', error);
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
        console.error('Error deleting plan:', error);
        throw error;
    }
};
