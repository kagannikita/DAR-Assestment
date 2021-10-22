import * as React from 'react'
import {useConverter} from "../../context/ConverterContext";
import styles from './form.module.scss'
interface ConverterSettings{
    type:string
    count:number
}

interface IData{
    number:number[]
    modules:number[]
}
interface ConverterSettings {
    type: string;
    count: number;
}

interface IData {
    number: number[];
    modules: number[];
}
const Form = () => {
    const [data, setData] = React.useState<IData>({ number: [], modules: [] });
    const [converterType, setConverterType] = React.useState<ConverterSettings>({
        type: "decimal",
        count: 2
    });
    const { state, dispatch } = useConverter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (converterType.type === "decimal" || converterType.type === "modular") {
            dispatch({
                type: converterType.type,
                number: data.number,
                modules: data.modules
            });
        }
        e.preventDefault();
    };

    return (
        <>
            <form className={styles.converter} onSubmit={handleSubmit}>
                <label htmlFor="converterType">Тип конвертирования</label>
                <select
                    onChange={(e) => {
                        setConverterType({
                            type: e.target.value,
                            count: converterType.count
                        });
                        setData({ number: [], modules: [] });
                    }}
                    required
                >
                    <option value="decimal">Десятичное в модульное</option>
                    <option value="modular">Модульное в десятичное</option>
                </select>
                <label htmlFor="count">Количество элементов</label>
                <select
                    onChange={(e) => {
                        setConverterType({
                            type: converterType.type,
                            count: parseInt(e.target.value)
                        });
                        setData({ number: [], modules: [] });
                    }}
                    required
                >
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
                {converterType.type === "decimal" ? (
                    <div className={styles.number}>
                        <label htmlFor="number" className={styles.label}>
                            Число
                        </label>
                        <input
                            type="number"
                            value={data.number[0]?data.number.toString():''}
                            required
                            onChange={(event) => {
                                setData((prevState) => {
                                    const newState = {
                                        ...prevState,
                                        number: [...prevState.number],
                                        modules: [...prevState.modules]
                                    };
                                    newState.number[0] = +event.target.value;
                                    return newState;
                                });
                            }}
                        />
                    </div>
                ) : (
                    <div className={styles.number}>
                        <label htmlFor="modules" className={styles.label}>
                            Система остатков
                        </label>
                        <div className={styles.rows}>
                            {Array.from({ length: converterType.count }, (_, i) => (
                                <input
                                    className={styles.small}
                                    value={data.number[i]?data.number[i].toString():''}
                                    type="number"
                                    key={i}
                                    onChange={(event) => {
                                        setData((prevState) => {
                                            const newState = {
                                                ...prevState,
                                                number: [...prevState.number],
                                                modules: [...prevState.modules]
                                            };
                                            newState.number[i] = +event.target.value;
                                            return newState;
                                        });
                                    }}
                                    required
                                />
                            ))}
                        </div>
                    </div>
                )}
                <div className={styles.number}>
                    <label htmlFor="modules" className={styles.label}>
                        Система оснований
                    </label>
                    <div className={styles.rows}>
                        {Array.from({ length: converterType.count }, (_, i) => (
                            <input
                                className={styles.small}
                                value={data.modules[i]?data.modules[i].toString():''}
                                type="number"
                                min="0"
                                key={i}
                                onChange={(event) => {
                                    setData((prevState) => {
                                        const newState = {
                                            ...prevState,
                                            number: [...prevState.number],
                                            modules: [...prevState.modules]
                                        };
                                        newState.modules[i] = +event.target.value;
                                        return newState;
                                    });
                                }}
                                required
                            />
                        ))}
                    </div>
                </div>
                <button type="submit">Convert</button>
            </form>
            <h2>Result:
                {state.result.length > 1
                    ? `{ ${state.result.join(", ")} }`
                    : state.result}
            </h2>
        </>
    );
};
export default Form;
