package ke.zian.chatter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.ArrayList;

public class ChattAdapter extends ArrayAdapter<Chatt> {
    public ChattAdapter(Context context, ArrayList<Chatt> users) {
        super(context, 0, users);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        Chatt chatt = getItem(position);
        if (convertView == null) {
            convertView = LayoutInflater.from(getContext()).inflate(R.layout.chatt_item, parent,
                    false);
        }
        TextView usernameTextView = (TextView) convertView.findViewById(R.id.usernameTextView);
        TextView messageTextView = (TextView) convertView.findViewById(R.id.messageTextView);
        TextView timestampTextView = (TextView) convertView.findViewById(R.id.timestampTextView);
        usernameTextView.setText(chatt.username);
        messageTextView.setText(chatt.message);
        timestampTextView.setText(chatt.timestamp);
        return convertView;
    }
}