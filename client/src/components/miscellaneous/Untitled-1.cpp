#include<bits/stdc++.h>
#include<iostream>

using namespace std;
int main()
{
        int n;
        cin>>n;

        for(int i=0;i<2*n-2;i++)
        {
                for(int j=0;j<2*n-2;j++)
                {
                        int top=i;
                        int left=j;
                        int bottom=2*(n-1)-i;
                        int right=2*(n-1)-j;

                        cout<<n-min(top,min(left,min(bottom,right)))<<" ";
                }
                cout<<endl;
        }
}