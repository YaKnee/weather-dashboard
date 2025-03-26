const mean = (data) => {
    const sum = data.reduce((acc,val) => acc + val, 0);
    return (sum / data.length).toFixed(2);
}

const median = (data) => {
    const sorted = data.sort((a,b) => a-b);
    const middle = Math.floor(sorted.length/2);
    if(sorted.length % 2 == 0) {
        return ((sorted[middle - 1] + sorted[middle]) / 2).toFixed(2);
    } else {
        return sorted[middle];
    }
}

const mode = (data) => {
    const frequency = {};
    data.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
    });

    let maxValue = 0;
    let maxKey = null;
    for (const [key, value] of Object.entries(frequency)) {
        if (value > maxValue) {
            maxValue = value;
            maxKey = key;
        }
    }
    // console.log(frequency);
    // console.log(maxValue);
    // console.log(maxKey);
    return maxKey;
}

const range = (data) => {
    return (max(data) - min(data)).toFixed(1);
}

//Standard Deviation
const std = (data) => {
    const avg = mean(data);
    //const squaredDiffs = data.map(num => (num - avg) **2);  Short hand version
    const squaredDiffs = data.map(num => Math.pow((num - avg), 2));
    const variance = mean(squaredDiffs);
    return Math.sqrt(variance).toFixed(2);
}

const min = (data) => {
    return (Math.min(...data)).toFixed(1);
}

const max = (data) => {
    return (Math.max(...data)).toFixed(1);
}