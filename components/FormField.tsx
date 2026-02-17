'use client';
import React, { useState } from 'react'
import { FormControl, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

interface FormFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'file'
}

const FormField = <T extends FieldValues>({ control, name, label, placeholder, type = "text" }: FormFieldProps<T>) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className='label'>{label}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                className='input'
                                placeholder={placeholder}
                                type={isPasswordField && showPassword ? 'text' : type}
                                {...field}
                            />
                            {isPasswordField && (
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-all duration-200 hover:scale-110 active:scale-95"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    <div className="relative w-5 h-5">
                                        <Eye
                                            className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${showPassword
                                                    ? 'opacity-0 rotate-90 scale-50'
                                                    : 'opacity-100 rotate-0 scale-100'
                                                }`}
                                        />
                                        <EyeOff
                                            className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${showPassword
                                                    ? 'opacity-100 rotate-0 scale-100'
                                                    : 'opacity-0 -rotate-90 scale-50'
                                                }`}
                                        />
                                    </div>
                                </button>
                            )}
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormField
