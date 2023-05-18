import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface IDialogState {
    onChange?:(hours:number, minutes:number)=>void
    hours?: number
    minutes?: number
    onHide?:()=>void
    visible: boolean
}

interface IDialogPayload {
    onChange?:(hours:number, minutes:number)=>void
    hours?: number
    minutes?: number
    onHide?:()=>void
}

const initialState = {visible: false} as IDialogState

const timePickerSlice = createSlice({
  name: 'timePicker',
  initialState,
  reducers: {
    showTimePicker(state, action: PayloadAction<IDialogPayload>) {
        state.hours = action.payload.hours
        state.minutes = action.payload.minutes
        state.onChange = action.payload.onChange
        state.onHide = action.payload.onHide
        state.visible = true
    },
    hideTimePicker(state) {
        state.visible = false
    }
  },
})

export const { showTimePicker, hideTimePicker } = timePickerSlice.actions
export default timePickerSlice.reducer